# -*- coding: utf-8 -*-
"""
Công cụ hỗ trợ: Tự động kiểm tra và lấy CHAT_ID từ Telegram Bot API
Giúp giải quyết vấn đề người dùng chưa có hoặc chưa lưu CHAT_ID vào .env
"""

import os
import sys
import time
import requests
from dotenv import load_dotenv, set_key

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8933902666:AAFvBDHkZvw5mpiu83Kh_pCgMy7NGLhfjSc")
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")


def check_updates():
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getUpdates"
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        if not data.get("ok"):
            print(f"❌ Lỗi Telegram API: {data.get('description')}")
            return None

        results = data.get("result", [])
        if not results:
            return None

        # Lấy tin nhắn mới nhất
        last_update = results[-1]
        msg = last_update.get("message", {}) or last_update.get("my_chat_member", {})
        chat = msg.get("chat", {})
        sender = msg.get("from", {})

        return {
            "chat_id": chat.get("id"),
            "first_name": sender.get("first_name", ""),
            "last_name": sender.get("last_name", ""),
            "username": sender.get("username", ""),
            "text": msg.get("text", "")
        }
    except Exception as e:
        print(f"❌ Lỗi kết nối: {e}")
        return None


def main():
    print("=" * 60)
    print("🔍 CÔNG CỤ TỰ ĐỘNG XÁC MINH CHAT ID TELEGRAM")
    print("=" * 60)
    print("👉 Hãy mở Telegram trên điện thoại/máy tính:")
    print("   1. Tìm bot: @nguyenthanhanbot")
    print("   2. Bấm nút 'START' (hoặc gửi bất kỳ tin nhắn nào, ví dụ: 'hi')")
    print("=" * 60)
    print("⏳ Đang chờ tin nhắn từ bạn (nhấn Ctrl+C để dừng)...")

    found_info = None
    for attempt in range(1, 31):  # Chờ tối đa 60 giây
        info = check_updates()
        if info and info.get("chat_id"):
            found_info = info
            break
        print(f"[{attempt}/30] Đang kiểm tra...", end="\r")
        time.sleep(2)

    if found_info:
        chat_id = str(found_info["chat_id"])
        print("\n" + "=" * 60)
        print("🎉 TÌM THẤY THÔNG TIN NGƯỜI DÙNG!")
        print(f"👤 Tên: {found_info['first_name']} {found_info['last_name']}".strip())
        print(f"🏷️ Username: @{found_info['username']}" if found_info['username'] else "🏷️ Username: (Chưa đặt)")
        print(f"🆔 CHAT ID: {chat_id}")
        print(f"💬 Tin nhắn gần nhất: {found_info['text']}")
        print("=" * 60)

        # Cập nhật tự động vào file .env
        try:
            set_key(ENV_PATH, "CHAT_ID", chat_id)
            print("✅ ĐÃ TỰ ĐỘNG LƯU CHAT_ID VÀO FILE .env THÀNH CÔNG!")
            print("👉 Bây giờ bạn có thể chạy: python send_telegram.py")
        except Exception as e:
            print(f"⚠️ Vui lòng mở file .env và cập nhật CHAT_ID={chat_id} (Lỗi lưu: {e})")
    else:
        print("\n\n⚠️ Chưa nhận được tin nhắn nào từ bạn qua bot.")
        print("💡 Vui lòng mở link: https://t.me/nguyenthanhanbot và gửi /start, sau đó chạy lại script này.")


if __name__ == "__main__":
    main()
