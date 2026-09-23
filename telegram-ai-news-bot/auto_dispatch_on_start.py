# -*- coding: utf-8 -*-
"""
Tự động chờ người dùng bấm START trên bot @nguyenthanhanbot,
ngay khi nhận được tín hiệu -> tự động gửi ngay bản tin AI vào Telegram!
"""

import os
import sys
import time
import requests
from dotenv import load_dotenv, set_key

# Import các hàm từ send_telegram.py
from send_telegram import get_ai_news, translate_to_vi, format_message, send_telegram

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8933902666:AAFvBDHkZvw5mpiu83Kh_pCgMy7NGLhfjSc")
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")


def wait_for_user_and_send(max_seconds=120):
    print("=" * 65)
    print("📡 ĐANG CHỜ BẠN BẤM 'START' HOẶC GỬI TIN TỚI @nguyenthanhanbot...")
    print(f"👉 Link bot: https://t.me/nguyenthanhanbot")
    print("=" * 65)

    start_time = time.time()
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"

    while time.time() - start_time < max_seconds:
        try:
            res = requests.get(url, timeout=10)
            data = res.json()
            results = data.get("result", [])

            if results:
                last_msg = results[-1].get("message", {}) or results[-1].get("my_chat_member", {})
                chat_id = last_msg.get("chat", {}).get("id")
                user_info = last_msg.get("from", {})
                first_name = user_info.get("first_name", "")

                if chat_id:
                    print(f"\n🎉 ĐÃ NHẬN ĐƯỢC TÍN HIỆU TỪ: {first_name} (Chat ID: {chat_id})!")
                    
                    # Lưu Chat ID vào file .env
                    os.environ["CHAT_ID"] = str(chat_id)
                    try:
                        set_key(ENV_PATH, "CHAT_ID", str(chat_id))
                    except Exception:
                        pass

                    # Gửi tin nhắn chào mừng trước
                    welcome_url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
                    requests.post(welcome_url, json={
                        "chat_id": chat_id,
                        "text": f"👋 Chào {first_name}! Bot đã kết nối thành công với tài khoản của bạn.\nĐang lấy tin tức AI mới nhất để gửi cho bạn ngay..."
                    })

                    # Thu thập tin AI và gửi ngay lập tức
                    print("🚀 Đang lấy tin AI từ Google News RSS...")
                    raw_title, link = get_ai_news()
                    translated_title = translate_to_vi(raw_title)
                    msg = format_message(translated_title, link)
                    
                    print("📤 Đang gửi bản tin AI vào Telegram...")
                    send_telegram(msg)
                    print("\n✨ XONG! Bản tin AI đã được gửi tới Telegram của bạn thành công!")
                    return True

        except Exception as e:
            print(f"Lỗi polling: {e}")

        time.sleep(2)

    print("\n⏰ Hết thời gian chờ (2 phút). Vui lòng thử lại sau khi bấm START.")
    return False


if __name__ == "__main__":
    wait_for_user_and_send(120)
