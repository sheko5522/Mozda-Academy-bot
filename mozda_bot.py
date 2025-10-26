from telegram import Update, ReplyKeyboardMarkup, KeyboardButton, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import Application, CommandHandler, MessageHandler, CallbackQueryHandler, filters, ContextTypes
import datetime

BOT_TOKEN = "8298231029:AAECxN_PcPECCTW8WEQ0x9co9rx9DV1ZBHw"

# Kategoriyalar va narxlari
CATEGORIES = {
    "🛒 Shopify Kurslari": {
        "price": "299 ming so'm",
        "courses": [
            "📦 Printify kursi",
            "🌐 Dropshipping", 
            "💻 Liquid kodlari",
            "📧 Email marketing",
            "🎨 Dizayn templates"
        ]
    },
    "🍇 Uzum Market": {
        "price": "199 ming so'm",
        "courses": [
            "📘 Uzum Premium",
            "📦 Mahsulot joylash",
            "💰 Narx strategiyasi", 
            "📢 Marketing",
            "📈 Savdo oshirish"
        ]
    },
    "🇨🇳 Xitoy Kurslari": {
        "price": "99 ming so'm",
        "courses": [
            "🛒 1688 zakaz",
            "📦 Taobao zakaz",
            "🧺 Pinduoduo",
            "📱 WeChat buyurtma",
            "📇 Kontaktlar bazasi"
        ]
    },
    "🇹🇷 Turkiya Kursi": {
        "price": "99 ming so'm", 
        "courses": [
            "📦 Optom kanallar",
            "🛒 Zakaz qilish",
            "🚚 Yetkazuvchilar"
        ]
    },
    "📢 Marketing": {
        "price": "99 ming so'm",
        "courses": [
            "📸 Instagram kursi",
            "✈️ Telegram kursi", 
            "🌐 SMM kursi",
            "🎥 YouTube kursi",
            "📝 Content marketing"
        ]
    }
}

PACKAGE_PRICE = "895,000 so'm"
DISCOUNT_PRICE = "397 ming so'm"

# Karta ma'lumotlari
CARD_INFO = {
    "number": "4073 4200 3754 6953",
    "name": "Shaxzod Odilov"
}

# Guruh ID lari - O'Zgartiring!
COURSE_GROUPS = {
    "6 ta Kurs Jamlanmasi": -1001234567890,  # 6 kurs guruhi ID
    "🛒 Shopify Kurslari": -1001234567891,   # Shopify guruhi ID
    "🍇 Uzum Market": -1001234567892,        # Uzum guruhi ID
    "🇨🇳 Xitoy Kurslari": -1001234567893,    # Xitoy guruhi ID
    "🇹🇷 Turkiya Kursi": -1001234567894,     # Turkiya guruhi ID
    "📢 Marketing": -1001234567895           # Marketing guruhi ID
}

# KANAL ID
ADMIN_CHANNEL_ID = -1003297660888  # "Cheklarni tekshirish" kanali

# 1. ASOSIY MENYU
main_keyboard = [
    [KeyboardButton("📚 Kurslar ro'yxati")],
    [KeyboardButton("👨‍💼 Admin bilan bog'lanish")]
]
main_reply_markup = ReplyKeyboardMarkup(main_keyboard, resize_keyboard=True)

# 2. KURS KATEGORIYALARI
categories_keyboard = [
    [KeyboardButton("🛒 Shopify Kurslari"), KeyboardButton("🍇 Uzum Market")],
    [KeyboardButton("🇨🇳 Xitoy Kurslari"), KeyboardButton("🇹🇷 Turkiya Kursi")],
    [KeyboardButton("📢 Marketing"), KeyboardButton("🎁 6 ta Kurs Jamlanmasi")],
    [KeyboardButton("🔙 Orqaga")]
]
categories_reply_markup = ReplyKeyboardMarkup(categories_keyboard, resize_keyboard=True)

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
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
        
    elif category_name == "🎁 6 ta Kurs Jamlanmasi":
        package_text = f"""🎁 6 TA KURS JAMLAMASI

💰 Oddiy narx: {PACKAGE_PRICE}
🔥 Chegirmali narx: {DISCOUNT_PRICE}

📦 JAMLANMADA NIMA BOR:
• Shopify kurslari (299 ming)
• Uzum Market (199 ming) 
• Xitoy kurslari (99 ming)
• Turkiya kursi (99 ming)
• Marketing (99 ming)

🎁 MAXSUS BONUSLAR:
• Sun'iy Intellekt Kursi
• Mukammal Telegram Bot Yaratish  
• Shopify Maxsus Ma'lumotlar
• 4000+ AI & Chat Bot Worklov Sxemalari"""
        
        inline_keyboard = [
            [InlineKeyboardButton("🛒 Paketni sotib olish", callback_data="buy_6 ta Kurs Jamlanmasi")]
        ]
        inline_markup = InlineKeyboardMarkup(inline_keyboard)
        
        await update.message.reply_text(package_text, reply_markup=inline_markup)
        context.user_data['selected_course'] = "6 ta Kurs Jamlanmasi"
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

📞 Bog'lanish: +998 99 497 55 22"""
    
    await query.edit_message_text(payment_text, parse_mode='HTML')

async def handle_copy_card(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    # Karta raqamini alohida xabar sifatida yuborish (copy qilish uchun oson)
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
    
    user_info = f"👤 Foydalanuvchi: {user.first_name}"
    if user.username:
        user_info += f" (@{user.username})"
    user_info += f"\n🆔 ID: {user.id}"
    
    # Kurs nomini context'dan olamiz
    course_name = context.user_data.get('selected_course', 'Noma\'lum kurs')
    
    admin_message = f"🆕 YANGI TO'LOV CHEKI!\n\n{user_info}\n📦 Kurs: {course_name}\n⏰ Vaqt: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"
    
    inline_keyboard = [
        [
            InlineKeyboardButton("✅ Qabul qilinsin", callback_data=f"approve_{user.id}_{course_name}"),
            InlineKeyboardButton("❌ Rad etilsin", callback_data=f"reject_{user.id}_{course_name}")
        ]
    ]
    inline_markup = InlineKeyboardMarkup(inline_keyboard)
    
    # KANALGA chekni yuborish
    try:
        await context.bot.send_photo(
            chat_id=ADMIN_CHANNEL_ID,
            photo=photo.file_id,
            caption=admin_message,
            reply_markup=inline_markup
        )
        
        # Foydalanuvchiga xabar
        await update.message.reply_text(
            "✅ Chek qabul qilindi! Tekshirish uchun 'Cheklarni tekshirish' kanaliga yuborildi.\n\n⏳ Tez orada javob olasiz."
        )
    except Exception as e:
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
            return True
        return False
    except Exception as e:
        print(f"Guruhga qo'shishda xato: {e}")
        return False

async def handle_approval(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Admin tomonidan tasdiqlash"""
    query = update.callback_query
    await query.answer()
    
    callback_data = query.data
    parts = callback_data.split("_")
    user_id = int(parts[1])
    course_name = parts[2] if len(parts) > 2 else "Noma'lum kurs"
    action = parts[0]
    
    if action == "approve":
        # Foydalanuvchini kurs guruhiga qo'shish
        added_to_group = await add_user_to_group(context, user_id, course_name)
        
        if added_to_group:
            success_text = f"""✅ To'lovingiz qabul qilindi!

🎉 Tabriklaymiz! "{course_name}" kursi guruhiga qo'shildingiz.

📚 Endi kurs materiallariga ega bo'ldingiz!"""
        else:
            success_text = f"""✅ To'lovingiz qabul qilindi!

🎉 Tabriklaymiz! "{course_name}" kursi sizga taqdim qilindi.

📞 Guruhga qo'shilish uchun @Moonboys_5522 ga murojaat qiling."""
        
        try:
            await context.bot.send_message(
                chat_id=user_id,
                text=success_text
            )
        except:
            pass
            
        # Kanaldagi xabarni yangilash
        await query.edit_message_text(
            f"✅ TO'LOV TASDIQLANDI\n\n{query.message.caption}\n\n⏰ Tasdiqlangan: {datetime.datetime.now().strftime('%H:%M')}"
        )
        
    elif action == "reject":
        # Foydalanuvchiga rad etish xabari
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
        except:
            pass
            
        # Kanaldagi xabarni yangilash
        await query.edit_message_text(
            f"❌ TO'LOV RAD ETILDI\n\n{query.message.caption}\n\n⏰ Rad etilgan: {datetime.datetime.now().strftime('%H:%M')}"
        )

async def handle_buttons(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    
    if text == "📚 Kurslar ro'yxati":
        await show_categories(update, context)
    elif text == "👨‍💼 Admin bilan bog'lanish":
        await update.message.reply_text(
            "📞 Admin bilan bog'lanish:\n\n👨‍💼 Admin: @Moonboys_5522\n📱 Telefon: +998 99 497 55 22\n\n💬 Savollaringiz bo'lsa, bemalol murojaat qiling!"
        )
    elif text in CATEGORIES or text == "🎁 6 ta Kurs Jamlanmasi":
        await show_category_info(update, context)
    elif text == "🔙 Orqaga":
        await update.message.reply_text("🏠 Bosh menyu:", reply_markup=main_reply_markup)
    else:
        await update.message.reply_text("❌ Iltimos, pastdagi tugmalardan foydalaning!")

if __name__ == '__main__':
    app = Application.builder().token(BOT_TOKEN).build()
    
    # Handlerlar
    app.add_handler(CommandHandler('start', start_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_buttons))
    app.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    app.add_handler(CallbackQueryHandler(handle_buy_callback, pattern="^buy_"))
    app.add_handler(CallbackQueryHandler(handle_copy_card, pattern="^copy_card$"))
    app.add_handler(CallbackQueryHandler(handle_approval, pattern="^(approve|reject)_"))
    
    print("🤖 Mozda Academy Bot ishga tushdi!")
    print(f"📊 Cheklar kanalga yuboriladi: {ADMIN_CHANNEL_ID}")
    app.run_polling(drop_pending_updates=True)