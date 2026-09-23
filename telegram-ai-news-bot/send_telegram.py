# -*- coding: utf-8 -*-
"""
================================================================================
WORKFLOW AUTOMATION: AI NEWS TELEGRAM DISPATCHER (MÔ HÌNH OIPO)
================================================================================
Role: Automation Engineer
Framework: OIPO (Objective - Input - Process - Output)

1. OBJECTIVE:
   - Tự động hóa quy trình thu thập 1 tin tức AI mới nhất (AI, OpenAI, Google AI)
     từ Google News RSS, dịch tiêu đề sang tiếng Việt (không dùng googletrans)
     và gửi thông báo trực tiếp vào Telegram Chat/Channel đã chỉ định.

2. INPUT:
   - Google News RSS Feed (Query: AI, OpenAI, Google AI)
   - BOT_TOKEN: Lấy an toàn từ biến môi trường (.env)
   - CHAT_ID: Lấy an toàn từ biến môi trường (.env)

3. PROCESS:
   - get_ai_news(): Thu thập 1 tin mới nhất từ RSS -> bóc tách Title + Link.
   - translate_to_vi(): Dịch nội dung sang tiếng Việt qua REST API (không dùng googletrans).
   - format_message(): Định dạng bản tin theo mẫu chuẩn:
       🧠 Tin AI hôm nay - dd/mm/yyyy
       • [nội dung]
       Nguồn:
       [link]
       #AI #TinCongNghe
   - send_telegram(): Gửi bản tin qua Telegram Bot API bằng thư viện `requests`.

4. OUTPUT:
   - Tin nhắn hiển thị trực quan, tức thời trên Telegram người nhận.
================================================================================
"""

import os
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
import requests
from dotenv import load_dotenv

# Đảm bảo console Windows hiển thị đúng ký tự Unicode tiếng Việt
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Tải cấu hình bảo mật từ file .env
load_dotenv()

# Cấu hình nguồn cấp dữ liệu
GOOGLE_NEWS_RSS_URL = (
    "https://news.google.com/rss/search?q=AI+OpenAI+Google+AI&hl=en-US&gl=US&ceid=US:en"
)
MYMEMORY_API_URL = "https://api.mymemory.translated.net/get"


def translate_to_vi(text: str) -> str:
    """
    Dịch văn bản tiếng Anh sang tiếng Việt không sử dụng thư viện `googletrans`.
    Sử dụng MyMemory Translation REST API qua `requests` với cơ chế xử lý lỗi và fallback.
    
    Args:
        text (str): Văn bản tiếng Anh cần dịch.
        
    Returns:
        str: Văn bản đã được dịch sang tiếng Việt.
    """
    if not text or not text.strip():
        return text

    # Làm sạch tiêu đề: loại bỏ tên tòa soạn ở cuối (ví dụ: "... - The Verge") để bản dịch mượt hơn
    clean_text = text.strip()
    source_suffix = ""
    if " - " in clean_text:
        parts = clean_text.rsplit(" - ", 1)
        clean_text = parts[0]
        source_suffix = f" ({parts[1]})"

    try:
        params = {
            "q": clean_text,
            "langpair": "en|vi"
        }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-News-Automation/1.0"
        }
        
        response = requests.get(MYMEMORY_API_URL, params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            translated_text = data.get("responseData", {}).get("translatedText")
            if translated_text and translated_text.strip():
                return f"{translated_text.strip()}{source_suffix}"
            
        print(f"[Cảnh báo] API dịch trả về status code {response.status_code}, dùng văn bản gốc.")
        return text
    except requests.exceptions.RequestException as e:
        print(f"[Cảnh báo] Lỗi kết nối khi dịch: {e}. Sử dụng văn bản gốc.")
        return text
    except Exception as e:
        print(f"[Cảnh báo] Lỗi không xác định khi dịch: {e}. Sử dụng văn bản gốc.")
        return text


def get_ai_news() -> tuple[str, str]:
    """
    Lấy 1 tin tức AI mới nhất từ Google News RSS.
    
    Returns:
        tuple[str, str]: (tiêu đề gốc tiếng Anh, đường link bài viết)
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(GOOGLE_NEWS_RSS_URL, headers=headers, timeout=15)
        response.raise_for_status()

        # Parse cú pháp XML RSS Feed
        root = ET.fromstring(response.content)
        item = root.find(".//item")

        if item is None:
            raise ValueError("Không tìm thấy bài viết nào trong RSS Feed!")

        title_elem = item.find("title")
        link_elem = item.find("link")

        title = title_elem.text.strip() if title_elem is not None and title_elem.text else "Không có tiêu đề"
        link = link_elem.text.strip() if link_elem is not None and link_elem.text else "https://news.google.com"

        return title, link

    except requests.exceptions.RequestException as e:
        print(f"[Lỗi mạng] Không thể tải RSS Feed: {e}")
        raise
    except ET.ParseError as e:
        print(f"[Lỗi cú pháp XML] Không thể đọc cấu trúc RSS: {e}")
        raise


def format_message(translated_title: str, link: str) -> str:
    """
    Định dạng nội dung tin nhắn gửi vào Telegram theo đúng template yêu cầu:
    
    🧠 Tin AI hôm nay - dd/mm/yyyy
    • [nội dung]
    Nguồn:
    [link]
    #AI #TinCongNghe
    """
    today_str = datetime.now().strftime("%d/%m/%Y")
    
    message = (
        f"🧠 Tin AI hôm nay - {today_str}\n"
        f"• {translated_title}\n"
        f"Nguồn:\n"
        f"{link}\n"
        f"#AI #TinCongNghe"
    )
    return message


def send_telegram(message: str) -> bool:
    """
    Gửi tin nhắn đến Telegram Chat/Channel thông qua Telegram Bot API bằng `requests`.
    API Token và Chat ID được lấy an toàn từ biến môi trường (.env).
    
    Args:
        message (str): Nội dung thông điệp cần gửi.
        
    Returns:
        bool: True nếu gửi thành công tất cả, False nếu có lỗi.
    """
    bot_token = os.getenv("BOT_TOKEN")
    raw_chat_ids = os.getenv("CHAT_IDS") or os.getenv("CHAT_ID")

    if not bot_token:
        print("[Lỗi bảo mật] Thiếu BOT_TOKEN trong file .env!")
        return False

    if not raw_chat_ids:
        print("[Lỗi cấu hình] Thiếu CHAT_ID / CHAT_IDS trong file .env!")
        return False

    # Tách danh sách Chat ID (hỗ trợ nhiều người nhận)
    chat_ids = [c.strip() for c in raw_chat_ids.split(",") if c.strip()]
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"

    all_success = True
    for chat_id in chat_ids:
        payload = {
            "chat_id": chat_id,
            "text": message,
            "disable_web_page_preview": False
        }
        try:
            response = requests.post(url, json=payload, timeout=15)
            data = response.json()

            if response.status_code == 200 and data.get("ok"):
                print(f" -> [Thành công] Đã gửi bản tin AI tới Chat ID: {chat_id}")
            else:
                all_success = False
                err = data.get("description", "Unknown error")
                print(f" -> [Thất bại] Lỗi gửi tới Chat ID {chat_id}: {err}")
                if "chat not found" in err.lower():
                    print(f"    💡 Tài khoản {chat_id} cần bấm START với bot: https://t.me/nguyenthanhanbot")
        except Exception as e:
            all_success = False
            print(f" -> [Lỗi kết nối] Chat ID {chat_id}: {e}")

    return all_success


def main():
    """Hàm điều phối quy trình tự động hóa (Automation Workflow Runner)"""
    print("=" * 65)
    print("🚀 BẮT ĐẦU WORKFLOW TỰ ĐỘNG LẤY VÀ GỬI TIN AI VÀO TELEGRAM")
    print("=" * 65)

    # Bước 1: Thu thập tin tức từ RSS
    print("\n[Bước 1/4] Đang lấy tin AI mới nhất từ Google News RSS...")
    try:
        raw_title, news_link = get_ai_news()
        print(f" -> Tiêu đề gốc (EN): {raw_title}")
        print(f" -> Nguồn link: {news_link}")
    except Exception as e:
        print(f" -> [Hủy bỏ] Không thể lấy tin tức: {e}")
        return

    # Bước 2: Dịch tiêu đề sang tiếng Việt
    print("\n[Bước 2/4] Đang dịch tiêu đề sang tiếng Việt (không dùng googletrans)...")
    translated_title = translate_to_vi(raw_title)
    print(f" -> Tiêu đề dịch (VI): {translated_title}")

    # Bước 3: Định dạng thông điệp
    print("\n[Bước 3/4] Đang định dạng bản tin...")
    formatted_msg = format_message(translated_title, news_link)
    print(" -> Nội dung tin nhắn chuẩn bị gửi:")
    print("-" * 40)
    print(formatted_msg)
    print("-" * 40)

    # Bước 4: Gửi tin nhắn vào Telegram
    print("\n[Bước 4/4] Đang gửi thông báo vào Telegram qua requests...")
    success = send_telegram(formatted_msg)
    
    if success:
        print("\n✨ HOÀN TẤT: Workflow đã thực thi thành công mỹ mãn!")
    else:
        print("\n⚠️ WORKFLOW TẠM DỪNG: Vui lòng kiểm tra hướng dẫn phía trên.")
    print("=" * 65)


if __name__ == "__main__":
    main()
