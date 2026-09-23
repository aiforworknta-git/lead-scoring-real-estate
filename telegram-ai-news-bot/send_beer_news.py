# -*- coding: utf-8 -*-
"""
================================================================================
WORKFLOW AUTOMATION: BEER MARKET NEWS TELEGRAM DISPATCHER (MÔ HÌNH OIPO)
================================================================================
Chuyên biệt: Cập nhật tin tức thị trường bia (Việt Nam & Quốc tế)
Thương hiệu trọng tâm: Heineken, Sabeco, Habeco, Tiger, Carlsberg, thị trường FMCG/Đồ uống
"""

import os
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
import requests
from dotenv import load_dotenv

# Đảm bảo console Windows in đúng tiếng Việt UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

load_dotenv()

# RSS Feed thị trường bia Việt Nam & Quốc tế
VIETNAM_BEER_RSS = (
    "https://news.google.com/rss/search?q=th%E1%BB%8B+tr%C6%B0%E1%BB%9Dng+bia+OR+ng%C3%A0nh+bia+OR+Heineken+OR+Sabeco&hl=vi&gl=VN&ceid=VN:vi"
)
GLOBAL_BEER_RSS = (
    "https://news.google.com/rss/search?q=Heineken+OR+%22beer+market%22+OR+%22brewing+industry%22&hl=en-US&gl=US&ceid=US:en"
)
MYMEMORY_API_URL = "https://api.mymemory.translated.net/get"


def is_vietnamese(text: str) -> bool:
    """Kiểm tra văn bản đã có sẵn ký tự tiếng Việt hay chưa"""
    vietnamese_chars = set("àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ")
    return any(c in vietnamese_chars for c in text.lower())


def translate_to_vi(text: str) -> str:
    """Dịch tiếng Anh sang tiếng Việt nếu tin tức từ nguồn quốc tế"""
    if not text or not text.strip():
        return text

    # Nếu đã là tiếng Việt thì không cần dịch
    if is_vietnamese(text):
        return text.strip()

    clean_text = text.strip()
    source_suffix = ""
    if " - " in clean_text:
        parts = clean_text.rsplit(" - ", 1)
        clean_text = parts[0]
        source_suffix = f" ({parts[1]})"

    try:
        params = {"q": clean_text, "langpair": "en|vi"}
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        response = requests.get(MYMEMORY_API_URL, params=params, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            translated = data.get("responseData", {}).get("translatedText")
            if translated and translated.strip():
                return f"{translated.strip()}{source_suffix}"
            
        return text
    except Exception as e:
        print(f"[Cảnh báo] Lỗi khi dịch: {e}")
        return text


def get_beer_news() -> tuple[str, str]:
    """
    Lấy tin tức thị trường bia mới nhất từ Google News RSS (ưu tiên tin trong nước, fallback quốc tế).
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    # Thử lấy tin tiếng Việt trước
    for rss_url in [VIETNAM_BEER_RSS, GLOBAL_BEER_RSS]:
        try:
            res = requests.get(rss_url, headers=headers, timeout=15)
            if res.status_code == 200:
                root = ET.fromstring(res.content)
                item = root.find(".//item")
                if item is not None:
                    title = item.find("title").text.strip() if item.find("title") is not None else ""
                    link = item.find("link").text.strip() if item.find("link") is not None else ""
                    if title:
                        return title, link
        except Exception as e:
            print(f"[Lỗi RSS {rss_url}]: {e}")

    raise ValueError("Không thể lấy tin thị trường bia từ các nguồn RSS!")


def format_beer_message(title: str, link: str) -> str:
    """
    Định dạng bản tin thị trường bia:
    🍺 Tin Thị Trường Bia Hôm Nay - dd/mm/yyyy
    • [nội dung]
    Nguồn:
    [link]
    #ThiTruongBia #Heineken #NganhDoUong #FMCG
    """
    today_str = datetime.now().strftime("%d/%m/%Y")
    return (
        f"🍺 Tin Thị Trường Bia Hôm Nay - {today_str}\n"
        f"• {title}\n"
        f"Nguồn:\n"
        f"{link}\n"
        f"#ThiTruongBia #Heineken #NganhDoUong #FMCG"
    )


def send_telegram(message: str) -> bool:
    """Gửi bản tin qua Telegram Bot API tới 1 hoặc nhiều Chat ID"""
    bot_token = os.getenv("BOT_TOKEN")
    raw_chat_ids = os.getenv("CHAT_IDS") or os.getenv("CHAT_ID")

    if not bot_token or not raw_chat_ids:
        print("[Lỗi] Thiếu BOT_TOKEN hoặc CHAT_ID/CHAT_IDS trong .env!")
        return False

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
            res = requests.post(url, json=payload, timeout=15)
            data = res.json()
            if res.status_code == 200 and data.get("ok"):
                print(f" -> [Thành công] Đã gửi bản tin Thị Trường Bia tới Chat ID: {chat_id}")
            else:
                all_success = False
                print(f" -> [Thất bại] Lỗi Chat ID {chat_id}: {data.get('description')}")
        except Exception as e:
            all_success = False
            print(f" -> [Lỗi kết nối] Chat ID {chat_id}: {e}")

    return all_success


def main():
    print("=" * 65)
    print("🍺 BẮT ĐẦU WORKFLOW TỰ ĐỘNG CẬP NHẬT TIN THỊ TRƯỜNG BIA")
    print("=" * 65)

    # 1. Thu thập tin tức
    print("\n[Bước 1/3] Đang tìm tin thị trường bia mới nhất từ Google News RSS...")
    raw_title, link = get_beer_news()
    print(f" -> Tiêu đề: {raw_title}")

    # 2. Dịch nếu là tin tiếng Anh
    print("\n[Bước 2/3] Xử lý ngôn ngữ bản tin...")
    final_title = translate_to_vi(raw_title)
    print(f" -> Bản tin: {final_title}")

    # 3. Định dạng và gửi tin
    print("\n[Bước 3/3] Gửi thông báo đến Telegram...")
    msg = format_beer_message(final_title, link)
    print("-" * 40)
    print(msg)
    print("-" * 40)

    success = send_telegram(msg)
    if success:
        print("\n✨ HOÀN TẤT: Bản tin Thị Trường Bia đã được gửi tới Telegram của bạn!")
    print("=" * 65)


if __name__ == "__main__":
    main()
