import telebot
from telebot import types
from pymongo import MongoClient
from datetime import datetime
import re

# ==================== SOZLAMALAR ====================
# BOT tokeni
TOKEN = "8261135129:AAGqAfE4H4RTPz1fiVO-tHLwFzAFVX2gk9Q"

# MongoDB URL (MongoDB Atlas yoki local MongoDB)
MONGO_URL = "mongodb://localhost:27017/"  # Bu joyga o'z MongoDB URL ni kiriting

# Obuna bo'lish kerak bo'lgan kanallar
CHANNELS = [
    "@Mozda_Academy",  # Mozda Academy kanali
]

# Kino yuklaydigan kanalingiz username (@ belgisiz)
MOVIE_CHANNEL = "Mozda_Academy"  # Mozda Academy - kino yuklaydigan kanal

# ==================== BOT VA DATABASE SOZLASH ====================
bot = telebot.TeleBot(TOKEN)

try:
    client = MongoClient(MONGO_URL)
    db = client["kinochi_bot"]
    movies_collection = db["movies"]
    users_collection = db["users"]
    stats_collection = db["statistics"]
    print("✅ MongoDB ga muvaffaqiyatli ulandi")
except Exception as e:
    print(f"❌ MongoDB ga ulanishda xatolik: {e}")
    print("⚠️ Bot MongoDB siz ishlaydi (faqat obuna tekshirish)")

# ==================== YORDAMCHI FUNKSIYALAR ====================

def check_subscription(user_id):
    """Foydalanuvchi kanallarga obuna bo'lganligini tekshirish"""
    for channel in CHANNELS:
        try:
            status = bot.get_chat_member(channel, user_id).status
            if status in ['left', 'kicked']:
                return False
        except Exception as e:
            print(f"Kanal tekshirishda xatolik: {e}")
            return False
    return True

def save_user(user):
    """Foydalanuvchini databasega saqlash"""
    try:
        users_collection.update_one(
            {"user_id": user.id},
            {
                "$set": {
                    "user_id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "username": user.username,
                    "last_seen": datetime.now()
                },
                "$setOnInsert": {
                    "joined_date": datetime.now(),
                    "total_requests": 0
                }
            },
            upsert=True
        )
    except:
        pass

def update_user_stats(user_id):
    """Foydalanuvchi statistikasini yangilash"""
    try:
        users_collection.update_one(
            {"user_id": user_id},
            {
                "$inc": {"total_requests": 1},
                "$set": {"last_seen": datetime.now()}
            }
        )
    except:
        pass

def show_subscription_request(chat_id):
    """Obuna bo'lish uchun xabar yuborish"""
    markup = types.InlineKeyboardMarkup(row_width=1)
    
    for channel in CHANNELS:
        markup.add(
            types.InlineKeyboardButton(
                text=f"📢 {channel}",
                url=f"https://t.me/{channel[1:]}"
            )
        )
    
    markup.add(
        types.InlineKeyboardButton(
            text="✅ Obunani Tekshirish",
            callback_data="check_subscription"
        )
    )
    
    message_text = (
        "🎬 <b>Kinochi Bot ga xush kelibsiz!</b>\n\n"
        "Botdan foydalanish uchun quyidagi kanallarga obuna bo'ling:\n\n"
        "Obuna bo'lgandan so'ng <b>'✅ Obunani Tekshirish'</b> tugmasini bosing."
    )
    
    bot.send_message(
        chat_id,
        message_text,
        parse_mode="HTML",
        reply_markup=markup
    )

def extract_movie_code(caption):
    """Caption dan kino kodini ajratib olish"""
    if not caption:
        return None
    
    # "Kod: 12345" formatidagi kodlarni qidirish
    patterns = [
        r'Kod[:\s]+(\d+)',
        r'kod[:\s]+(\d+)',
        r'CODE[:\s]+(\d+)',
        r'code[:\s]+(\d+)',
        r'#(\d+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, caption, re.IGNORECASE)
        if match:
            return match.group(1)
    
    return None

# ==================== KANAL POSTLARINI QABUL QILISH ====================

@bot.channel_post_handler(content_types=['video', 'document'])
def handle_channel_post(message):
    """Kanalga yuklangan videolarni avtomatik database ga saqlash"""
    try:
        # Faqat o'z kanalingizdan kelgan postlarni saqlash
        if message.chat.username == MOVIE_CHANNEL:
            
            # Video yoki document file_id ni olish
            file_id = None
            file_type = None
            
            if message.video:
                file_id = message.video.file_id
                file_type = "video"
            elif message.document:
                file_id = message.document.file_id
                file_type = "document"
            
            if file_id:
                # Caption dan kino kodini ajratib olish
                code = extract_movie_code(message.caption)
                
                # Database ga saqlash
                movie_data = {
                    "file_id": file_id,
                    "file_type": file_type,
                    "caption": message.caption,
                    "code": code,
                    "message_id": message.message_id,
                    "date_added": datetime.now()
                }
                
                # Agar kod mavjud bo'lsa, yangilash yoki yangi qo'shish
                if code:
                    movies_collection.update_one(
                        {"code": code},
                        {"$set": movie_data},
                        upsert=True
                    )
                    print(f"✅ Kino saqlandi: Kod {code}")
                else:
                    movies_collection.insert_one(movie_data)
                    print(f"✅ Kino saqlandi (kodsiz)")
                    
    except Exception as e:
        print(f"❌ Kanal postini saqlashda xatolik: {e}")

# ==================== BOT KOMANDALAR ====================

@bot.message_handler(commands=['start'])
def start_command(message):
    """Start komandasi"""
    user = message.from_user
    save_user(user)
    
    if check_subscription(user.id):
        welcome_text = (
            f"🎬 <b>Salom, {user.first_name}!</b>\n\n"
            "Kinochi botga xush kelibsiz! 🍿\n\n"
            "🔍 <b>Kino qidirish:</b>\n"
            "Kino kodini yuboring va kinoni oling\n\n"
            "📋 <b>Mavjud komandalar:</b>\n"
            "/help - Yordam\n"
            "/stats - Statistika (admin)\n\n"
            "💡 <b>Masalan:</b> 12345"
        )
        bot.send_message(
            message.chat.id,
            welcome_text,
            parse_mode="HTML"
        )
    else:
        show_subscription_request(message.chat.id)

@bot.message_handler(commands=['help'])
def help_command(message):
    """Yordam komandasi"""
    if not check_subscription(message.from_user.id):
        show_subscription_request(message.chat.id)
        return
    
    help_text = (
        "📖 <b>YORDAM</b>\n\n"
        "🎬 <b>Kino qidirish:</b>\n"
        "Kino kodini yuboring (faqat raqam)\n\n"
        "📋 <b>Komandalar:</b>\n"
        "/start - Botni ishga tushirish\n"
        "/help - Yordam\n"
        "/stats - Statistika (faqat admin)\n\n"
        "💡 <b>Misol:</b>\n"
        "12345 - bu kodni yuborsangiz, tegishli kino yuboriladi"
    )
    
    bot.send_message(
        message.chat.id,
        help_text,
        parse_mode="HTML"
    )

@bot.message_handler(commands=['stats'])
def stats_command(message):
    """Statistika komandasi (faqat admin)"""
    # Bu yerga admin ID larni qo'shing
    ADMIN_IDS = [message.from_user.id]  # O'z ID ingizni qo'shing
    
    if message.from_user.id not in ADMIN_IDS:
        bot.send_message(message.chat.id, "❌ Bu komanda faqat admin uchun")
        return
    
    try:
        total_users = users_collection.count_documents({})
        total_movies = movies_collection.count_documents({})
        movies_with_code = movies_collection.count_documents({"code": {"$ne": None}})
        
        stats_text = (
            "📊 <b>BOT STATISTIKASI</b>\n\n"
            f"👥 Jami foydalanuvchilar: <b>{total_users}</b>\n"
            f"🎬 Jami kinolar: <b>{total_movies}</b>\n"
            f"🔢 Kodli kinolar: <b>{movies_with_code}</b>\n"
        )
        
        bot.send_message(
            message.chat.id,
            stats_text,
            parse_mode="HTML"
        )
    except Exception as e:
        bot.send_message(
            message.chat.id,
            f"❌ Statistikani olishda xatolik: {e}"
        )

# ==================== CALLBACK HANDLER ====================

@bot.callback_query_handler(func=lambda call: call.data == "check_subscription")
def check_subscription_callback(call):
    """Obuna tekshirish tugmasi bosilganda"""
    user_id = call.from_user.id
    
    if check_subscription(user_id):
        welcome_text = (
            f"✅ <b>Obuna tasdiqlandi!</b>\n\n"
            f"Rahmat, {call.from_user.first_name}! 🎉\n\n"
            "Endi botdan to'liq foydalanishingiz mumkin.\n"
            "Kino kodini yuboring va kinoni oling! 🎬"
        )
        bot.edit_message_text(
            welcome_text,
            call.message.chat.id,
            call.message.message_id,
            parse_mode="HTML"
        )
    else:
        bot.answer_callback_query(
            call.id,
            "❌ Siz hali barcha kanallarga obuna bo'lmadingiz!",
            show_alert=True
        )

# ==================== XABARLARNI QAYTA ISHLASH ====================

@bot.message_handler(func=lambda message: True)
def handle_messages(message):
    """Barcha xabarlarni qayta ishlash"""
    user_id = message.from_user.id
    
    # Obunani tekshirish
    if not check_subscription(user_id):
        show_subscription_request(message.chat.id)
        return
    
    # Statistikani yangilash
    update_user_stats(user_id)
    
    # Agar raqam yuborilgan bo'lsa (kino kodi)
    if message.text and message.text.isdigit():
        code = message.text.strip()
        
        try:
            # Database dan kinoni qidirish
            movie = movies_collection.find_one({"code": code})
            
            if movie:
                # Kinoni yuborish
                if movie["file_type"] == "video":
                    bot.send_video(
                        message.chat.id,
                        movie["file_id"],
                        caption=movie.get("caption", "🎬 Kinoni tomosha qiling!"),
                        parse_mode="HTML"
                    )
                elif movie["file_type"] == "document":
                    bot.send_document(
                        message.chat.id,
                        movie["file_id"],
                        caption=movie.get("caption", "🎬 Kinoni yuklab oling!"),
                        parse_mode="HTML"
                    )
                
                print(f"✅ Kino yuborildi: {code} -> User: {user_id}")
            else:
                bot.send_message(
                    message.chat.id,
                    f"❌ <b>Kod: {code}</b> - bu kod bilan kino topilmadi.\n\n"
                    "Iltimos, to'g'ri kod yuboring.",
                    parse_mode="HTML"
                )
        except Exception as e:
            bot.send_message(
                message.chat.id,
                "❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
                parse_mode="HTML"
            )
            print(f"❌ Kino yuborishda xatolik: {e}")
    else:
        # Agar raqam bo'lmasa
        bot.send_message(
            message.chat.id,
            "❌ <b>Noto'g'ri format!</b>\n\n"
            "Iltimos, faqat kino kodini (raqam) yuboring.\n\n"
            "💡 Masalan: 12345",
            parse_mode="HTML"
        )

# ==================== BOTNI ISHGA TUSHIRISH ====================

if __name__ == "__main__":
    print("🤖 Kinochi Bot ishga tushdi...")
    print(f"📢 Kanal: @{MOVIE_CHANNEL}")
    print(f"👥 Obuna kanallari: {', '.join(CHANNELS)}")
    print("⏳ Xabarlar kutilmoqda...\n")
    
    try:
        bot.polling(none_stop=True, interval=0)
    except Exception as e:
        print(f"❌ Bot ishida xatolik: {e}")
