from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
import datetime
import os
import logging

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
        "price": "59 ming so'm",
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

# Karta ma'lumotlari (KARTA RAQAMI ALMASHTIRILDI)
CARD_INFO = {
    "number": "5614 6819 0336 6205",
    "name": "Shaxzod Odilov"
}

# Guruh ID lari - O'Zgartiring!
COURSE_GROUPS = {
    "To'liq paket jamlanmasi": -1001234567890,  # O'ZGARTIRILDI
    "🛒 Shopify Kurslari": -1001234567891,
    "🍇 Uzum Market": -1001234567892,
    "🇨🇳 Xitoy Kurslari": -1001234567893,
    "🇹🇷 Turkiya Kursi": -1001234567894,
    "📢 Marketing": -1001234567895
}

# KANAL ID
ADMIN_CHANNEL_ID = -1003297660888

# 1. ASOSIY MENYU
main_keyboard = [
    [KeyboardButton("📚 Kurslar ro'yxati")],
    [KeyboardButton("👨‍💼 Admin bilan bog'lanish")]
]
main_reply_markup = ReplyKeyboardMarkup(main_keyboard, resize_keyboard=True)

# 2. KURS KATEGORIYALARI (O'ZGARTIRILDI)
categories_keyboard = [
    [KeyboardButton("🛒 Shopify Kurslari"), KeyboardButton("🍇 Uzum Market")],
    [KeyboardButton("🇨🇳 Xitoy Kurslari"), KeyboardButton("🇹🇷 Turkiya Kursi")],
    [KeyboardButton("📢 Marketing"), KeyboardButton("🎁 To'liq paket jamlanmasi")],  # O'ZGARTIRILDI
    [KeyboardButton("🔙 Orqaga")]
]
categories_reply_markup = ReplyKeyboardMarkup(categories_keyboard, resize_keyboard=True)

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    logger.info(f"User {user.id} started the bot")
    await update.message.reply_text(
        f"Assalomu aleykum {user.first_name}! 👋\n\nMozda Academy botiga xush kelibsiz!\n\n✨ Siz bu botda professional darajaga va daromadga cho'qqiga chiqasiz!",
        reply_markup=main_reply_markup
    )

async def show_categories(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📚 BIZNING KURSLAR\n\n🎯 Quyidagi kurslardan birini tanlang:",
        reply_markup=categories_reply_markup
    )

async def show_category_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    category_name = update.message.text
    
    if category_name in CATEGORIES:
        category = CATEGORIES[category_name]
        
        info_text = f"""🎓 {category_name}
💵 Narxi: {category['price']}

📋 Kurs tarkibi:"""
        
        for course in category['courses']:
            info_text += f"\n• {course}"
        
        inline_keyboard = [
            [InlineKeyboardButton("🛒 Sotib olish", callback_data=f"buy_{category_name}")]
        ]
        inline_markup = InlineKeyboardMarkup(inline_keyboard)
        
        await update.message.reply_text(info_text, reply_markup=inline_markup)
        context.user_data['selected_course'] = category_name
        context.user_data['course_price'] = category['price']
        
    elif category_name == "🎁 To'liq paket jamlanmasi":  # O'ZGARTIRILDI
        package_text = f"""🎁 TO'LIQ PAKET JAMLAMASI

💰 Asl narxi: {PACKAGE_PRICE}
🔥 AKSIYA NARXI: {DISCOUNT_PRICE}
📉 196 000 so'm tejaysiz
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
        inline_markup = InlineKeyboardMarkup(inline_keyboard)
        
        await update.message.reply_text(package_text, reply_markup=inline_markup)
        context.user_data['selected_course'] = "To'liq paket jamlanmasi"
        context.user_data['course_price'] = DISCOUNT_PRICE
    
    else:
        await update.message.reply_text("❌ Iltimos, pastdagi tugmalardan foydalaning!")

async def handle_buy_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    callback_data = query.data
    course_name = callback_data.replace("buy_", "")
    course_price = context.user_data.get('course_price', '')
    
    payment_text = f"""💳 TO'LOV MA'LUMOTLARI

📦 Mahsulot: {course_name}
💵 Narxi: {course_price}

🏦 Karta raqami:
<code>{CARD_INFO['number']}</code>

👤 Karta egasi: {CARD_INFO['name']}

💡 To'lov qilgach, chek skrinshotini shu botga yuboring.

📞 Bog'lanish: @Moonboys_5522"""
    
    await query.edit_message_text(payment_text, parse_mode='HTML')

async def handle_copy_card(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    copy_text = f"""📋 Karta raqamini nusxalash uchun:

Karta raqami:
<code>{CARD_INFO['number']}</code>

👤 Karta egasi: {CARD_INFO['name']}

💡 Raqamni bosib nusxalang va bank ilovasiga o'ting."""
    
    await query.message.reply_text(copy_text, parse_mode='HTML')

async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Rasm (chek) yuborilganda ishlaydi"""
    user = update.effective_user
    photo = update.message.photo[-1]
    
    logger.info(f"Received payment screenshot from user {user.id}")
    
    user_info = f"👤 Foydalanuvchi: {user.first_name}"
    if user.username:
        user_info += f" (@{user.username})"
    user_info += f"\n🆔 ID: {user.id}"
    
    course_name = context.user_data.get('selected_course', 'Noma\'lum kurs')
    
    # Toshkent vaqt zonasi uchun (UTC+5) - REAL VAQT
    current_time = datetime.datetime.now() + datetime.timedelta(hours=5)
    formatted_time = current_time.strftime('%d.%m.%Y | %H:%M:%S')
    
    admin_message = f"🆕 YANGI TO'LOV CHEKI!\n\n{user_info}\n📦 Kurs: {course_name}\n⏰ Vaqt: {formatted_time}"
    
    inline_keyboard = [
        [
            InlineKeyboardButton("✅ Qabul qilinsin", callback_data=f"approve_{user.id}_{course_name}"),
            InlineKeyboardButton("❌ Rad etilsin", callback_data=f"reject_{user.id}_{course_name}")
        ]
    ]
    inline_markup = InlineKeyboardMarkup(inline_keyboard)
    
    try:
        await context.bot.send_photo(
            chat_id=ADMIN_CHANNEL_ID,
            photo=photo.file_id,
            caption=admin_message,
            reply_markup=inline_markup
        )
        
        await update.message.reply_text(
            "✅ Chek qabul qilindi! \n\n⏳ Tez orada javob olasiz."
        )
        logger.info(f"Screenshot sent to admin channel for user {user.id}")
    except Exception as e:
        logger.error(f"Error sending screenshot to admin: {e}")
        await update.message.reply_text(
            f"❌ Xatolik yuz berdi. Iltimos, @Moonboys_5522 ga to'g'ridan-to'g'ri chekni yuboring."
        )

async def add_user_to_group(context, user_id, course_name):
    """Foydalanuvchini kurs guruhiga qo'shish"""
    try:
        group_id = COURSE_GROUPS.get(course_name)
        if group_id:
            await context.bot.add_chat_member(
                chat_id=group_id,
                user_id=user_id
            )
            logger.info(f"User {user_id} added to group {group_id}")
            return True
        return False
    except Exception as e:
        logger.error(f"Error adding user to group: {e}")
        return False

async def handle_approval(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Admin tomonidan tasdiqlash"""
    query = update.callback_query
    await query.answer()
    
    callback_data = query.data
    parts = callback_data.split("_", 2)
    action = parts[0]
    user_id = int(parts[1])
    course_name = parts[2] if len(parts) > 2 else "Noma'lum kurs"
    
    # Toshkent vaqt zonasi uchun (UTC+5) - REAL VAQT
    current_time = datetime.datetime.now() + datetime.timedelta(hours=5)
    formatted_time = current_time.strftime('%d.%m.%Y | %H:%M:%S')
    
    if action == "approve":
        added_to_group = await add_user_to_group(context, user_id, course_name)
        
        if added_to_group:
            success_text = f"""✅ To'lovingiz qabul qilindi!

🎉 Tabriklaymiz! "{course_name}" kursi guruhiga qo'shildingiz.

📚 Endi kurs materiallariga ega bo'ldingiz!"""
        else:
            success_text = f"""✅ To'lovingiz qabul qilindi!

🎉 Tabriklaymiz! "{course_name}" kursi sizga taqdim qilinadi.

📞 Kurs guruhiga qo'shilish uchun @Moonboys_5522 ga murojaat qiling."""
        
        try:
            await context.bot.send_message(
                chat_id=user_id,
                text=success_text
            )
            logger.info(f"Approval notification sent to user {user_id}")
        except Exception as e:
            logger.error(f"Error sending approval to user: {e}")
            
        await query.edit_message_caption(
            caption=f"✅ TO'LOV TASDIQLANDI\n\n{query.message.caption}\n\n⏰ Tasdiqlangan vaqt: {formatted_time}"
        )
        
    elif action == "reject":
        reject_text = """❌ To'lovingiz rad etildi!

ℹ️ Sabab: Chek soxta yoki noto'g'ri.

💡 Iltimos:
1. Qaytadan urinib ko'ring, yoki
2. @Moonboys_5522 ga murojaat qiling"""
        
        try:
            await context.bot.send_message(
                chat_id=user_id,
                text=reject_text
            )
            logger.info(f"Rejection notification sent to user {user_id}")
        except Exception as e:
            logger.error(f"Error sending rejection to user: {e}")
            
        await query.edit_message_caption(
            caption=f"❌ TO'LOV RAD ETILDI\n\n{query.message.caption}\n\n⏰ Rad etilgan vaqt: {formatted_time}"
        )

async def handle_buttons(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    
    if text == "📚 Kurslar ro'yxati":
        await show_categories(update, context)
    elif text == "👨‍💼 Admin bilan bog'lanish":
        await update.message.reply_text(
            "📞 Admin bilan bog'lanish:\n\n👨‍💼 Admin: @Moonboys_5522\n\n💬 Savollaringiz bo'lsa, bemalol murojaat qiling!"
        )
    elif text in CATEGORIES or text == "🎁 To'liq paket jamlanmasi":  # O'ZGARTIRILDI
        await show_category_info(update, context)
    elif text == "🔙 Orqaga":
        await update.message.reply_text("🏠 Bosh menyu:", reply_markup=main_reply_markup)
    else:
        await update.message.reply_text("❌ Iltimos, pastdagi tugmalardan foydalaning!")

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Error handler"""
    logger.error(f"Update {update} caused error {context.error}")

def main():
    """Bot ishga tushirish"""
    logger.info("Starting Mozda Academy Bot...")
    
    app = Application.builder().token(BOT_TOKEN).build()
    
    # Handlerlar
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_buttons))
    app.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    app.add_handler(CallbackQueryHandler(handle_buy_callback, pattern="^buy_"))
    app.add_handler(CallbackQueryHandler(handle_copy_card, pattern="^copy_card$"))
    app.add_handler(CallbackQueryHandler(handle_approval, pattern="^(approve|reject)_"))
    
    # Error handler
    app.add_error_handler(error_handler)
    
    logger.info("🤖 Mozda Academy Bot ishga tushdi!")
    logger.info(f"📊 Cheklar kanalga yuboriladi: {ADMIN_CHANNEL_ID}")
    
    # Polling rejimida ishga tushirish
    app.run_polling(
        allowed_updates=Update.ALL_TYPES,
        drop_pending_updates=True
    )

if __name__ == '__main__':
    main()
