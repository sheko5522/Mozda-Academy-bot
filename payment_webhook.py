"""
Click va Payme Webhook Server
To'lov amalga oshirilganda avtomatik 1 martalik invite link yuboradi
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import hashlib
import hmac
import json
import logging
import os
import base64
from datetime import datetime, timedelta
import httpx
import asyncio

# Logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Mozda Academy Payment Webhook")

# ====== SOZLAMALAR ======
BOT_TOKEN = os.environ.get('BOT_TOKEN', "8298231029:AAECxN_PcPECCTW8WEQ0x9co9rx9DV1ZBHw")
TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"

# Payme
PAYME_MERCHANT_ID = os.environ.get('PAYME_MERCHANT_ID', '')
PAYME_KEY         = os.environ.get('PAYME_KEY', '')

# Click
CLICK_SERVICE_ID       = os.environ.get('CLICK_SERVICE_ID', '')
CLICK_MERCHANT_ID      = os.environ.get('CLICK_MERCHANT_ID', '')
CLICK_SECRET_KEY       = os.environ.get('CLICK_SECRET_KEY', '')
CLICK_MERCHANT_USER_ID = os.environ.get('CLICK_MERCHANT_USER_ID', '')

# Narxlar (tiyin)
PRICES = {
    "99000": "To'liq paket jamlanmasi",
    "59000": "Alohida kurs",
}

# Guruh IDlari - botni guruhga qo'shib /get_id buyrug'ini ishlating
COURSE_GROUPS = {
    "To'liq paket jamlanmasi": int(os.environ.get('GROUP_FULL_PACKAGE', '0')),
    "🛒 Shopify Kurslari": int(os.environ.get('GROUP_SHOPIFY', '0')),
    "🍇 Uzum Market": int(os.environ.get('GROUP_UZUM', '0')),
    "🇨🇳 Xitoy Kurslari": int(os.environ.get('GROUP_CHINA', '0')),
    "🇹🇷 Turkiya Kursi": int(os.environ.get('GROUP_TURKEY', '0')),
    "📢 Marketing": int(os.environ.get('GROUP_MARKETING', '0')),
}

# To'lovlar holati (takroriy xabar yuborilmasligi uchun)
processed_payments = set()


# ====== YORDAMCHI FUNKSIYALAR ======

async def get_course_by_amount(amount_tiyin: int) -> str:
    """To'lov miqdoriga qarab kurs nomini aniqlash"""
    if amount_tiyin >= 9900000:  # 99,000 so'm
        return "To'liq paket jamlanmasi"
    return "To'liq paket jamlanmasi"  # Default


async def create_invite_link(group_id: int, user_id: int) -> str | None:
    """Telegram API orqali 1 martalik invite link yaratish"""
    try:
        expire_date = int((datetime.now() + timedelta(days=1)).timestamp())
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{TELEGRAM_API}/createChatInviteLink",
                json={
                    "chat_id": group_id,
                    "name": f"User_{user_id}_{datetime.now().strftime('%d%m%H%M')}",
                    "expire_date": expire_date,
                    "member_limit": 1,  # Faqat 1 marta ishlatiladi!
                    "creates_join_request": False
                }
            )
            data = response.json()
            if data.get("ok"):
                return data["result"]["invite_link"]
            else:
                logger.error(f"Invite link yaratishda xato: {data}")
                return None
    except Exception as e:
        logger.error(f"create_invite_link xatosi: {e}")
        return None


async def send_invite_to_user(user_id: int, course_name: str, payment_method: str):
    """Foydalanuvchiga 1 martalik invite link yuborish"""
    group_id = COURSE_GROUPS.get(course_name, 0)

    if not group_id:
        logger.error(f"Guruh IDsi topilmadi: {course_name}")
        await send_error_message(user_id)
        return

    invite_link = await create_invite_link(group_id, user_id)

    if invite_link:
        emoji = "🔴" if payment_method == "payme" else "🔵"
        text = (
            f"✅ To'lovingiz muvaffaqiyatli qabul qilindi!\n\n"
            f"{emoji} {payment_method.capitalize()} orqali to'lov tasdiqlandi.\n\n"
            f"🎓 Kurs: {course_name}\n\n"
            f"🔗 Guruhga kirish linki:\n{invite_link}\n\n"
            f"⚠️ <b>Diqqat!</b> Bu link <b>faqat 1 marta</b> va <b>24 soat</b> davomida ishlatiladi.\n"
            f"Linkni hech kimga bermang!"
        )
        await send_telegram_message(user_id, text)
        logger.info(f"Invite link yuborildi: user={user_id}, kurs={course_name}")
    else:
        await send_error_message(user_id)


async def send_telegram_message(chat_id: int, text: str):
    """Telegram orqali xabar yuborish"""
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                f"{TELEGRAM_API}/sendMessage",
                json={
                    "chat_id": chat_id,
                    "text": text,
                    "parse_mode": "HTML"
                }
            )
    except Exception as e:
        logger.error(f"Telegram xabar yuborishda xato: {e}")


async def send_error_message(user_id: int):
    """Xatolik yuz berganda admin bilan bog'lanishni tavsiya qilish"""
    text = (
        "✅ To'lovingiz qabul qilindi!\n\n"
        "⚠️ Guruh linkini yuborishda texnik muammo yuz berdi.\n\n"
        "📞 Iltimos, @Moonboys_5522 ga murojaat qiling.\n"
        "Admin sizga tez orada guruhga qo'shadi."
    )
    await send_telegram_message(user_id, text)


# ====== PAYME WEBHOOK ======

def verify_payme_auth(request_headers: dict) -> bool:
    """Payme so'rovini tekshirish"""
    auth_header = request_headers.get("authorization", "")
    if not auth_header.startswith("Basic "):
        return False
    try:
        decoded = base64.b64decode(auth_header[6:]).decode()
        _, password = decoded.split(":", 1)
        return password == PAYME_KEY
    except Exception:
        return False


@app.post("/payme")
async def payme_webhook(request: Request):
    """Payme webhook endpoint"""
    # Auth tekshirish
    if not verify_payme_auth(dict(request.headers)):
        logger.warning("Payme: noto'g'ri auth!")
        raise HTTPException(status_code=401, detail="Unauthorized")

    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")

    method = body.get("method", "")
    params = body.get("params", {})
    request_id = body.get("id", 1)

    logger.info(f"Payme method: {method}, params: {params}")

    # CheckPerformTransaction
    if method == "CheckPerformTransaction":
        return JSONResponse({
            "id": request_id,
            "result": {"allow": True}
        })

    # CreateTransaction
    elif method == "CreateTransaction":
        transaction_id = params.get("id", "")
        return JSONResponse({
            "id": request_id,
            "result": {
                "create_time": int(datetime.now().timestamp() * 1000),
                "transaction": transaction_id,
                "state": 1
            }
        })

    # PerformTransaction — TO'LOV AMALGA OSHDI!
    elif method == "PerformTransaction":
        transaction_id = params.get("id", "")
        account = params.get("account", {})

        # Foydalanuvchi Telegram ID sini olish (order_id orqali)
        user_id_str = account.get("user_id") or params.get("order_id", "")

        if transaction_id not in processed_payments and user_id_str:
            processed_payments.add(transaction_id)
            try:
                user_id = int(user_id_str)
                amount = params.get("amount", 9900000)
                course_name = await get_course_by_amount(amount)
                # Asinxron link yuborish
                asyncio.create_task(
                    send_invite_to_user(user_id, course_name, "payme")
                )
            except (ValueError, Exception) as e:
                logger.error(f"Payme perform error: {e}")

        return JSONResponse({
            "id": request_id,
            "result": {
                "transaction": transaction_id,
                "perform_time": int(datetime.now().timestamp() * 1000),
                "state": 2
            }
        })

    # CancelTransaction
    elif method == "CancelTransaction":
        transaction_id = params.get("id", "")
        return JSONResponse({
            "id": request_id,
            "result": {
                "transaction": transaction_id,
                "cancel_time": int(datetime.now().timestamp() * 1000),
                "state": -1
            }
        })

    # CheckTransaction
    elif method == "CheckTransaction":
        transaction_id = params.get("id", "")
        return JSONResponse({
            "id": request_id,
            "result": {
                "create_time": int(datetime.now().timestamp() * 1000),
                "perform_time": int(datetime.now().timestamp() * 1000),
                "cancel_time": 0,
                "transaction": transaction_id,
                "state": 2,
                "reason": None
            }
        })

    # GetStatement
    elif method == "GetStatement":
        return JSONResponse({
            "id": request_id,
            "result": {"transactions": []}
        })

    else:
        return JSONResponse({
            "id": request_id,
            "error": {
                "code": -32601,
                "message": "Method not found",
                "data": method
            }
        })


# ====== CLICK WEBHOOK ======

def verify_click_signature(params: dict) -> bool:
    """Click imzosini tekshirish"""
    try:
        sign_string = "{}{}{}{}{}{}{}".format(
            params.get("click_trans_id", ""),
            params.get("service_id", ""),
            CLICK_SECRET_KEY,
            params.get("merchant_trans_id", ""),
            params.get("amount", ""),
            params.get("action", ""),
            params.get("sign_time", "")
        )
        expected_sign = hashlib.md5(sign_string.encode()).hexdigest()
        received_sign = params.get("sign_string", "")
        return expected_sign == received_sign
    except Exception as e:
        logger.error(f"Click sign verify xatosi: {e}")
        return False


@app.post("/click")
async def click_webhook(request: Request):
    """Click webhook endpoint"""
    try:
        # Click form data yuboradi
        form = await request.form()
        params = dict(form)
    except Exception:
        try:
            params = await request.json()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid request")

    logger.info(f"Click webhook keldi: {params}")

    action = int(params.get("action", -1))
    click_trans_id = params.get("click_trans_id", "")
    merchant_trans_id = params.get("merchant_trans_id", "")  # Bu user_id
    error = int(params.get("error", 0))

    # Imzo tekshirish
    if not verify_click_signature(params):
        logger.warning("Click: noto'g'ri imzo!")
        return JSONResponse({
            "click_trans_id": click_trans_id,
            "merchant_trans_id": merchant_trans_id,
            "error": -1,
            "error_note": "SIGN CHECK FAILED!"
        })

    # Action 0 = Prepare (to'lovni tekshirish)
    if action == 0:
        return JSONResponse({
            "click_trans_id": click_trans_id,
            "merchant_trans_id": merchant_trans_id,
            "merchant_prepare_id": click_trans_id,
            "error": 0,
            "error_note": "Success"
        })

    # Action 1 = Complete — TO'LOV AMALGA OSHDI!
    elif action == 1:
        if error == 0 and click_trans_id not in processed_payments:
            processed_payments.add(click_trans_id)
            try:
                user_id = int(merchant_trans_id)
                amount_str = params.get("amount", "99000")
                amount = int(float(amount_str))
                course_name = await get_course_by_amount(amount * 100)
                # Asinxron link yuborish
                asyncio.create_task(
                    send_invite_to_user(user_id, course_name, "click")
                )
                logger.info(f"Click to'lov tasdiqlandi: user={user_id}")
            except (ValueError, Exception) as e:
                logger.error(f"Click complete error: {e}")

        return JSONResponse({
            "click_trans_id": click_trans_id,
            "merchant_trans_id": merchant_trans_id,
            "merchant_confirm_id": click_trans_id,
            "error": 0,
            "error_note": "Success"
        })

    return JSONResponse({
        "click_trans_id": click_trans_id,
        "merchant_trans_id": merchant_trans_id,
        "error": -8,
        "error_note": "Error in request from click"
    })


# ====== HEALTH CHECK ======

@app.get("/")
async def health_check():
    return {"status": "ok", "service": "Mozda Academy Payment Webhook"}


@app.get("/health")
async def health():
    return {
        "status": "running",
        "payme": bool(PAYME_KEY),
        "click": bool(CLICK_SECRET_KEY),
        "groups": {k: bool(v) for k, v in COURSE_GROUPS.items()}
    }


# ====== ISHGA TUSHIRISH ======
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
