from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton, ChatInviteLink
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
import datetime
import os
import logging
from datetime import timedelta

# Logging sozlash
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Environment variables dan token olish
BOT_TOKEN = os.environ.get('BOT_TOKEN', "8298231029:AAECxN_PcPECCTW8WEQ0x9co9rx9DV1ZBHw")

# Kategoriyalar va narxlari
CATEGORIES = {
    "🛒 Shopify Kurslari": {
        "price": "10 ming so'm",  # ← TEST: vaqtinchalik 10 000 so'm
        "courses": [
            "📦 Printify kursi",
            "🌐 Dropshipping",
            "💻 Liquid kodlari",
            "📧 Email marketing",
            "🎨 Dizayn templates"
        ]
    },
    "🍇 Uzum Market": {
        "price": "59 ming so'm",
        "courses": [
            "📘 Uzum Premium",
            "📦 Mahsulot joylash",
            "💰 Narx strategiyasi",
            "📢 Marketing",
            "📈 Savdo oshirish"
        ]
    },
    "🇨🇳 Xitoy Kurslari": {
        "price": "59 ming so'm",
        "courses": [
            "🛒 1688 zakaz",
            "📦 Taobao zakaz",
            "🧺 Pinduoduo",
            "📱 WeChat buyurtma",
            "📇 Kontaktlar bazasi"
        ]
    },
    "🇹🇷 Turkiya Kursi": {
        "price": "59 ming so'm",
        "courses": [
            "📦 Optom kanallar",
            "🛒 Zakaz qilish",
            "🚚 Yetkazuvchilar"
        ]
    },
    "📢 Marketing": {
        "price": "59 ming so'm",
        "courses": [
            "📸 Instagram kursi",
            "✈️ Telegram kursi",
            "🌐 SMM kursi",
            "🎥 YouTube kursi",
            "📝 Content marketing"
        ]
    }
}
PACKAGE_PRICE = "295,000 so'm"
DISCOUNT_PRICE = "99,000 so'm"

# ====== TO'LOV TIZIMLARI ======
# Kalitlar GitHub da ko'rinmaydi — Render Environment Variables da saqlanadi!
PAYME_MERCHANT_ID      = os.environ.get('PAYME_MERCHANT_ID', '')       # Render da kiriting
CLICK_SERVICE_ID       = os.environ.get('CLICK_SERVICE_ID', '')        # Render da kiriting
CLICK_MERCHANT_ID      = os.environ.get('CLICK_MERCHANT_ID', '')       # Render da kiriting
CLICK_SECRET_KEY       = os.environ.get('CLICK_SECRET_KEY', '')        # Render da kiriting
CLICK_MERCHANT_USER_ID = os.environ.get('CLICK_MERCHANT_USER_ID', '') # Render da kiriting

# Admin Telegram username
ADMIN_USERNAME = "Moonboys_5522"

# Guruh ID lari — /get_id buyrug'i bilan aniqlang
COURSE_GROUPS = {
    "To'liq paket jamlanmasi": int(os.environ.get('GROUP_FULL_PACKAGE', '0')),
    "🛒 Shopify Kurslari":     int(os.environ.get('GROUP_SHOPIFY', '0')),
    "🍇 Uzum Market":          int(os.environ.get('GROUP_UZUM', '0')),
    "🇨🇳 Xitoy Kurslari":     int(os.environ.get('GROUP_CHINA', '0')),
    "🇹🇷 Turkiya Kursi":      int(os.environ.get('GROUP_TURKEY', '0')),
    "📢 Marketing":            int(os.environ.get('GROUP_MARKETING', '0')),
}

# ====== MINI APP URL ======
# WEBAPP_URL o'chirildi — oddiy bot ishlatilmoqda

# ====== KLAVIATURALAR ======
main_keyboard = [
    [KeyboardButton("📚 Kurslar ro'yxati")],
    [KeyboardButton("👨💼 Admin bilan bog'lanish")]
]
main_reply_markup = ReplyKeyboardMarkup(main_keyboard, resize_keyboard=True)

categories_keyboard = [
    [KeyboardButton("🛒 Shopify Kurslari"), KeyboardButton("🍇 Uzum Market")],
    [KeyboardButton("🇨🇳 Xitoy Kurslari"), KeyboardButton("🇹🇷 Turkiya Kursi")],
    [KeyboardButton("📢 Marketing"), KeyboardButton("🎁 To'liq paket jamlanmasi")],
    [KeyboardButton("🔙 Orqaga")]
]
categories_reply_markup = ReplyKeyboardMarkup(categories_keyboard, resize_keyboard=True)


# ====== ASOSIY KOMANDALAR ======

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    logger.info(f"User {user.id} started the bot")
    await update.message.reply_text(
        f"Assalomu aleykum {user.first_name}! 👋\n\nMozda Academy botiga xush kelibsiz!\n\n"
        f"✨ Siz bu botda professional darajaga va daromadga cho'qqiga chiqasiz!",
        reply_markup=main_reply_markup
    )


async def get_id_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Guruh va chat IDsini ko'rsatish (sozlash uchun)"""
    chat = update.effective_chat
    user = update.effective_user
    msg = (
        f"📊 Chat Ma'lumotlari:\n\n"
        f"🆔 Chat ID: <code>{chat.id}</code>\n"
        f"📝 Chat nomi: {chat.title or chat.first_name}\n"
        f"👤 Sizning ID: <code>{user.id}</code>"
    )
    await update.message.reply_text(msg, parse_mode='HTML')


# ====== KURSLAR ======

async def show_categories(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📚 BIZNING KURSLAR\n\n"
        "👇 Qaysi kursni ko'rmoqchisiz?",
        reply_markup=categories_reply_markup
    )


async def show_category_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    category_name = update.message.text

    if category_name in CATEGORIES:
        category = CATEGORIES[category_name]
        info_text = f"🎓 {category_name}\n💵 Narxi: {category['price']}\n\n📋 Kurs tarkibi:"
        for course in category['courses']:
            info_text += f"\n• {course}"

        inline_keyboard = [
            [InlineKeyboardButton("🛒 Sotib olish", callback_data=f"buy_{category_name}")]
        ]
        await update.message.reply_text(info_text, reply_markup=InlineKeyboardMarkup(inline_keyboard))
        context.user_data['selected_course'] = category_name
        context.user_data['course_price'] = category['price']

    elif category_name == "🎁 To'liq paket jamlanmasi":
        package_text = """🎁 TO'LIQ PAKET JAMLAMASI

🔥 99 000 so'm

⏳ Faqat cheklangan muddat uchun!

📊 JAMLANMA TARKIBI:

            🔤 Mozda Academya
               ⚡️ Pro yo'nalish.

📱 Target Pro (professional reklama)
🤖 Sun'iy intellekt yordamida video yaratish
📈 Canva Pro bepul olish
🤨 Kuchli promtlar to'plami
🤖 Mukammal Telegram bot yaratish
🤖 4000+ AI workflow sxemasi
📱 Emoji va shablonlar to'plami
📱 Biznesni oshiruvchi kitoblar to'plami


    🛒 SHOPIFY YO'NALISHI

💸 Shopify Dropshipping kursi
💸 Printify kursi
💸 Shopify Liquid kodlari
💸 T-shirt dizaynlari
💸 Bakal dizaynlari
💸 SEO, Robotx
💸 Email marketing baza
🎁 Shopify BONUSLAR


   🍇 UZUM MARKET YO'NALISHI

🍇 Uzum Premium kursi

       🇨🇳 XITOY VA TURKIYA YO'NALISHI

🇨🇳 1688 kursi
🇨🇳 Taobao kursi
🇨🇳 Pinduoduo kursi
🌐 WeChat kursi
🌐 WeChat kontaktlar bazasi
🇹🇷 Turkiya kursi
🇹🇷 Turkiya optom 300 ta kanallari

        📱 MARKETING YO'NALISHI

📱 Instagram kursi
📣 SMM kursi
✈️ Telegram kursi
📹 YouTube kursi

💡 O'z bilimingiz uchun sarmoya qilgan pulingizga achinmaysiz.
🚀 2026-yilda birgalikda natijaga chiqaylik!"""

        inline_keyboard = [
            [InlineKeyboardButton("🛒 Paketni sotib olish", callback_data="buy_To'liq paket jamlanmasi")]
        ]
        await update.message.reply_text(package_text, reply_markup=InlineKeyboardMarkup(inline_keyboard))
        context.user_data['selected_course'] = "To'liq paket jamlanmasi"
        context.user_data['course_price'] = DISCOUNT_PRICE

    else:
        await update.message.reply_text("❌ Iltimos, pastdagi tugmalardan foydalaning!")


# ====== TO'LOV ======

async def handle_buy_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    course_name = query.data.replace("buy_", "")
    course_price = context.user_data.get('course_price', '')

    amount_som = 99000 if "99" in course_price else (10000 if "10" in course_price else 59000)
    amount_tiyin = amount_som * 100

    user_id = query.from_user.id

    # Payme URL
    payme_url = (
        f"https://checkout.paycom.uz/{PAYME_MERCHANT_ID}"
        f"?amount={amount_tiyin}&order_id={user_id}"
    )

    # Click URL (4 ta maydon)
    # SERVICE_ID        → CLICK_SERVICE_ID
    # MERCHANT_ID       → CLICK_MERCHANT_ID
    # SECRET_KEY        → payment_webhook.py da imzo tekshirish uchun
    # merchant user id  → CLICK_MERCHANT_USER_ID
    click_url = (
        f"https://my.click.uz/services/pay"
        f"?service_id={CLICK_SERVICE_ID}"
        f"&merchant_id={CLICK_MERCHANT_ID}"
        f"&amount={amount_som}"
        f"&transaction_param={user_id}"
        f"&merchant_user_id={CLICK_MERCHANT_USER_ID}"
        f"&return_url=https://t.me/{ADMIN_USERNAME}"
    )

    payment_text = (
        f"💳 TO'LOV USULINI TANLANG\n\n"
        f"📦 Mahsulot: {course_name}\n"
        f"💵 Narxi: {course_price}\n\n"
        f"✅ To'lovdan so'ng guruh linki <b>avtomatik</b> yuboriladi!\n\n"
        f"👇 Qulay to'lov usulini tanlang:"
    )

    inline_keyboard = [
        [InlineKeyboardButton("🔴 Payme orqali to'lash", url=payme_url)],
        [InlineKeyboardButton("🔵 Click orqali to'lash", url=click_url)],
    ]
    await query.edit_message_text(payment_text, reply_markup=InlineKeyboardMarkup(inline_keyboard), parse_mode='HTML')


# ====== 1 MARTALIK INVITE LINK ======

async def create_and_send_invite_link(context, user_id: int, course_name: str):
    """1 martalik invite link yaratib foydalanuvchiga yuborish"""
    try:
        group_id = COURSE_GROUPS.get(course_name)
        if not group_id or group_id == 0:
            logger.warning(f"Guruh IDsi topilmadi: {course_name}")
            await context.bot.send_message(
                chat_id=user_id,
                text=(
                    "✅ To'lovingiz qabul qilindi!\n\n"
                    "📞 Guruhga qo'shilish uchun @Moonboys_5522 ga murojaat qiling."
                )
            )
            return

        # 1 martalik, 24 soatlik invite link
        expire_time = datetime.datetime.now() + timedelta(hours=24)
        invite_link: ChatInviteLink = await context.bot.create_chat_invite_link(
            chat_id=group_id,
            name=f"User_{user_id}",
            expire_date=expire_time,
            member_limit=1,
            creates_join_request=False
        )

        success_text = (
            f"✅ To'lovingiz tasdiqlandi! 🎉\n\n"
            f"🎓 Kurs: {course_name}\n\n"
            f"🔗 Guruhga kirish linki:\n"
            f"{invite_link.invite_link}\n\n"
            f"⚠️ <b>Muhim!</b> Bu link <b>faqat 1 marta</b> va "
            f"<b>24 soat</b> davomida amal qiladi.\n"
            f"Linkni hech kimga bermang!"
        )
        await context.bot.send_message(
            chat_id=user_id,
            text=success_text,
            parse_mode='HTML'
        )
        logger.info(f"1 martalik invite link yuborildi: user={user_id}, kurs={course_name}")

    except Exception as e:
        logger.error(f"Invite link yaratishda xato: {e}")
        await context.bot.send_message(
            chat_id=user_id,
            text=(
                "✅ To'lovingiz qabul qilindi!\n\n"
                "⚠️ Texnik muammo yuz berdi. @Moonboys_5522 ga murojaat qiling."
            )
        )


# ====== TUGMALAR ======

async def handle_buttons(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text

    if text == "📚 Kurslar ro'yxati":
        await show_categories(update, context)
    elif text == "👨💼 Admin bilan bog'lanish":
        await update.message.reply_text(
            "📞 Admin bilan bog'lanish:\n\n"
            "👨💼 Admin: @Moonboys_5522\n\n"
            "💬 Savollaringiz bo'lsa, bemalol murojaat qiling!"
        )
    elif text in CATEGORIES or text == "🎁 To'liq paket jamlanmasi":
        await show_category_info(update, context)
    elif text == "🔙 Orqaga":
        await update.message.reply_text("🏠 Bosh menyu:", reply_markup=main_reply_markup)
    else:
        await update.message.reply_text("❌ Iltimos, pastdagi tugmalardan foydalaning!")


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Error handler"""
    logger.error(f"Update {update} caused error {context.error}")


# ====== ISHGA TUSHIRISH ======

def main():
    """Bot ishga tushirish"""
    logger.info("Starting Mozda Academy Bot...")

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(CommandHandler('get_id', get_id_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_buttons))
    app.add_handler(CallbackQueryHandler(handle_buy_callback, pattern="^buy_"))

    app.add_error_handler(error_handler)

    logger.info("🤖 Mozda Academy Bot ishga tushdi!")
    logger.info("💳 To'lovlar: Click + Payme webhook orqali avtomatik")

    app.run_polling(
        allowed_updates=Update.ALL_TYPES,
        drop_pending_updates=True
    )


if __name__ == '__main__':
    main()
