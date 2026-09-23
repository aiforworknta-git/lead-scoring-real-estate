# -*- coding: utf-8 -*-
"""
================================================================================
HỆ THỐNG ĐIỂM TIN ĐIỀU HÀNH: EXECUTIVE AI & INDUSTRY DIGEST
================================================================================
Chuyên mục:
1. 🍺 Bia & Chuỗi Cung Ứng FMCG (AI in Brewing, Beverage, Heineken)
2. 🔌 Điện Máy & Gia Dụng Thông Minh (Smart Home, Samsung, LG AI)
3. 💃 Hot Girl & Virtual Influencer AI (KOL ảo, Người mẫu số, Tiếp thị thế hệ mới)

Định dạng: Telegram HTML với thẻ khung viền <blockquote>, đánh số 1️⃣-5️⃣
Phân tích: Insight & Góc nhìn chiến lược dành cho lãnh đạo/quản lý
================================================================================
"""

import os
import sys
import html
import re
import xml.etree.ElementTree as ET
from datetime import datetime
import requests
from dotenv import load_dotenv

# Đảm bảo in đúng UTF-8 trên console Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Tải cấu hình biến môi trường
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
RAW_CHAT_IDS = os.getenv("CHAT_IDS") or os.getenv("CHAT_ID")
MYMEMORY_API_URL = "https://api.mymemory.translated.net/get"

# Cấu hình nguồn RSS cho 3 chủ đề trọng tâm
TOPIC_RSS_SOURCES = {
    "beer": [
        "https://news.google.com/rss/search?q=(AI+OR+%22tr%C3%AD+tu%E1%BB%87+nh%C3%A2n+t%E1%BA%A1o%22)+(bia+OR+Heineken+OR+brewery+OR+%22ng%C3%A0nh+bia%22)&hl=vi&gl=VN&ceid=VN:vi",
        "https://news.google.com/rss/search?q=(AI+OR+%22artificial+intelligence%22)+(%22beer+industry%22+OR+brewing+OR+Heineken+OR+brewery)&hl=en-US&gl=US&ceid=US:en"
    ],
    "appliances": [
        "https://news.google.com/rss/search?q=AI+(%22%C4%91i%E1%BB%87n+m%C3%A1y%22+OR+%22gia+d%E1%BB%A5ng%22+OR+%22Samsung+AI%22+OR+%22LG+AI%22)&hl=vi&gl=VN&ceid=VN:vi",
        "https://news.google.com/rss/search?q=AI+(%22smart+appliances%22+OR+%22smart+home%22+OR+%22consumer+electronics%22+OR+Samsung+OR+LG)&hl=en-US&gl=US&ceid=US:en"
    ],
    "virtual_influencer": [
        "https://news.google.com/rss/search?q=(%22ng%C6%B0%E1%BB%9Di+m%E1%BA%ABu+%E1%BA%A3o%22+OR+%22KOL+%E1%BA%A3o%22+OR+%22hot+girl+AI%22+OR+%22AI+influencer%22)&hl=vi&gl=VN&ceid=VN:vi",
        "https://news.google.com/rss/search?q=(%22virtual+influencer%22+OR+%22AI+influencer%22+OR+%22virtual+model%22+OR+%22virtual+human%22)&hl=en-US&gl=US&ceid=US:en"
    ]
}


def clean_html_tags(raw_html: str) -> str:
    """Làm sạch các thẻ HTML và ký tự rác khỏi chuỗi"""
    if not raw_html:
        return ""
    clean = re.sub(r"<.*?>", "", raw_html)
    clean = html.unescape(clean)
    return clean.strip()


def is_vietnamese(text: str) -> bool:
    """Kiểm tra văn bản đã có ký tự tiếng Việt hay chưa"""
    vietnamese_chars = set("àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđĐ")
    return any(c in vietnamese_chars for c in text.lower())


def translate_to_vi(text: str) -> str:
    """
    Dịch tiếng Anh sang tiếng Việt mượt mà qua REST API (không dùng googletrans).
    Nếu đã là tiếng Việt thì giữ nguyên để bảo tồn văn phong gốc.
    """
    if not text or not text.strip():
        return text

    if is_vietnamese(text):
        return text.strip()

    clean_text = text.strip()
    source_suffix = ""
    if " - " in clean_text:
        parts = clean_text.rsplit(" - ", 1)
        clean_text = parts[0]
        source_suffix = f" ({parts[1]})"

    try:
        params = {"q": clean_text[:450], "langpair": "en|vi"}
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI-Digest/2.0"}
        res = requests.get(MYMEMORY_API_URL, params=params, headers=headers, timeout=10)
        if res.status_code == 200:
            data = res.json()
            translated = data.get("responseData", {}).get("translatedText")
            if translated and translated.strip():
                return f"{translated.strip()}{source_suffix}"
    except Exception as e:
        print(f"[Cảnh báo dịch]: {e}")

    return text


def fetch_news_from_feed(feed_url: str, max_items: int = 3) -> list[dict]:
    """Thu thập bài viết từ một RSS feed cụ thể"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    articles = []
    try:
        res = requests.get(feed_url, headers=headers, timeout=12)
        if res.status_code == 200:
            root = ET.fromstring(res.content)
            for item in root.findall(".//item")[:max_items]:
                title_elem = item.find("title")
                link_elem = item.find("link")
                desc_elem = item.find("description")

                title = title_elem.text.strip() if title_elem is not None and title_elem.text else ""
                link = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
                desc = clean_html_tags(desc_elem.text) if desc_elem is not None and desc_elem.text else ""

                # Cắt gọn mô tả tóm tắt
                if desc and len(desc) > 160:
                    desc = desc[:157] + "..."

                if title and link:
                    articles.append({
                        "title": title,
                        "link": link,
                        "summary": desc
                    })
    except Exception as e:
        print(f"[Lỗi RSS {feed_url}]: {e}")

    return articles


def collect_top_5_news() -> list[dict]:
    """
    Thu thập chính xác 5 tin tức hàng đầu được phân bổ theo 3 nhóm:
    - 2 tin: Bia & Chuỗi Cung Ứng FMCG
    - 2 tin: Điện Máy & Gia Dụng Thông Minh
    - 1 tin: Hot Girl & Virtual Influencer AI
    """
    results = []

    # 1. Thu thập 2 tin Bia
    beer_items = []
    for url in TOPIC_RSS_SOURCES["beer"]:
        beer_items.extend(fetch_news_from_feed(url, max_items=2))
        if len(beer_items) >= 2:
            break
    for item in beer_items[:2]:
        item["category"] = "🍺 NGÀNH BIA & CHUỖI CUNG ỨNG FMCG"
        results.append(item)

    # 2. Thu thập 2 tin Điện Máy
    appliances_items = []
    for url in TOPIC_RSS_SOURCES["appliances"]:
        appliances_items.extend(fetch_news_from_feed(url, max_items=2))
        if len(appliances_items) >= 2:
            break
    for item in appliances_items[:2]:
        item["category"] = "🔌 ĐIỆN MÁY & GIA DỤNG THÔNG MINH"
        results.append(item)

    # 3. Thu thập 1 tin Hot Girl / Virtual Influencer
    influencer_items = []
    for url in TOPIC_RSS_SOURCES["virtual_influencer"]:
        influencer_items.extend(fetch_news_from_feed(url, max_items=2))
        if len(influencer_items) >= 1:
            break
    for item in influencer_items[:1]:
        item["category"] = "💃 HOT GIRL & VIRTUAL INFLUENCER AI"
        results.append(item)

    # Dịch tiêu đề & tóm tắt sang tiếng Việt nếu cần
    for item in results:
        item["title_vi"] = translate_to_vi(item["title"])
        if item.get("summary"):
            item["summary_vi"] = translate_to_vi(item["summary"])
        else:
            item["summary_vi"] = "Cập nhật những tiến bộ và xu hướng công nghệ mới nhất trong lĩnh vực."

    return results


def build_executive_insight() -> str:
    """
    Tạo nội dung nhận xét / insight chuyên sâu về xu hướng AI kết nối giữa 3 lĩnh vực
    """
    insight_text = (
        "<b>1. Trục Vận Hành & Tự Động Hóa (Ngành Bia & Điện Máy):</b><br/>"
        "AI đang dịch chuyển từ mức 'phân tích dữ liệu tĩnh' sang 'hệ điều hành thời gian thực'. "
        "Trong ngành bia (điển hình như Heineken), AI kết hợp IoT tối ưu hóa quy trình ủ bia và dự báo tồn kho chuỗi cung ứng. "
        "Tương tự, các ông lớn điện máy (Samsung, LG) đưa Physical AI vào thiết bị gia dụng biến ngôi nhà thành không gian tự phục vụ thông minh.<br/><br/>"
        "<b>2. Trục Tiếp Thị Đột Phá (Virtual Influencer / Hot Girl AI):</b><br/>"
        "Sự bùng nổ của các KOLs và người mẫu ảo AI đang tái định hình chi phí truyền thông thương hiệu. "
        "Doanh nghiệp có thể tạo ra đại sứ thương hiệu cá nhân hóa 24/7 với chi phí giảm tới 70%, loại bỏ hoàn toàn rủi ro khủng hoảng đời tư và dễ dàng mở rộng tệp khách hàng trẻ.<br/><br/>"
        "<b>📌 Khuyến nghị hành động:</b><br/>"
        "Doanh nghiệp FMCG và Bán lẻ nên thử nghiệm tích hợp AI vào 2 mắt xích: (1) Tự động hóa báo cáo vận hành & (2) Thử nghiệm hình ảnh AI trong chiến dịch tiếp thị số ngay trong Quý này."
    )
    return insight_text


def format_telegram_html(news_items: list[dict], insight_html: str) -> str:
    """
    Định dạng toàn bộ bản tin bằng mã Telegram HTML chuẩn:
    - Có khung thẻ viền blockquote
    - Đánh số thứ tự 1️⃣ - 5️⃣ rõ ràng
    - Trình bày chuyên nghiệp, trang trọng
    """
    today_str = datetime.now().strftime("%d/%m/%Y")
    number_emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]

    lines = []
    lines.append("╔═══════════════════════════╗")
    lines.append(f"  🌟 <b>BẢN TIN AI & THỊ TRƯỜNG ĐIỀU HÀNH</b> 🌟")
    lines.append(f"  📅 <i>Cập nhật: {today_str} | Bản Chuyên Sâu</i>")
    lines.append("╚═══════════════════════════╝")
    lines.append("")

    for idx, item in enumerate(news_items):
        num_icon = number_emojis[idx] if idx < len(number_emojis) else f"#{idx+1}"
        category = html.escape(item["category"])
        title_vi = html.escape(item["title_vi"])
        summary_vi = html.escape(item["summary_vi"])
        link = item["link"]

        lines.append(f"{num_icon} <b>{category}</b>")
        lines.append(f"<blockquote><b>{title_vi}</b>\n<i>{summary_vi}</i>\n👉 <a href=\"{link}\">Đọc toàn văn bài viết</a></blockquote>")
        lines.append("")

    # Phần Insight chiến lược
    lines.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    lines.append("💡 <b>INSIGHT & GÓC NHÌN CHIẾN LƯỢC ĐIỀU HÀNH:</b>")
    # Thay <br/> thành \n trong blockquote
    clean_insight = insight_html.replace("<br/>", "\n").replace("<br>", "\n")
    lines.append(f"<blockquote>{clean_insight}</blockquote>")
    lines.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    lines.append("#AI #Heineken #ThiTruongBia #DienMay #VirtualInfluencer #ExecutiveDigest")

    return "\n".join(lines)


def send_to_recipients(html_message: str) -> bool:
    """Gửi bản tin định dạng HTML đến toàn bộ danh sách CHAT_IDS trong .env"""
    if not BOT_TOKEN:
        print("[Lỗi bảo mật] Thiếu BOT_TOKEN trong .env!")
        return False

    if not RAW_CHAT_IDS:
        print("[Lỗi cấu hình] Thiếu CHAT_IDS trong .env!")
        return False

    chat_ids = [c.strip() for c in RAW_CHAT_IDS.split(",") if c.strip()]
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    all_success = True
    for chat_id in chat_ids:
        payload = {
            "chat_id": chat_id,
            "text": html_message,
            "parse_mode": "HTML",
            "disable_web_page_preview": True
        }
        try:
            res = requests.post(url, json=payload, timeout=20)
            data = res.json()
            if res.status_code == 200 and data.get("ok"):
                print(f" -> [Thành công] Đã gửi bản tin Điều Hành tới Chat ID: {chat_id}")
            else:
                all_success = False
                err_desc = data.get("description", "Unknown error")
                print(f" -> [Thất bại] Lỗi gửi tới Chat ID {chat_id}: {err_desc}")
        except Exception as e:
            all_success = False
            print(f" -> [Lỗi kết nối] Chat ID {chat_id}: {e}")

    return all_success


def main():
    print("=" * 70)
    print("🚀 KHỞI ĐỘNG HỆ THỐNG ĐIỂM TIN ĐIỀU HÀNH (EXECUTIVE AI DIGEST)")
    print("=" * 70)

    # 1. Thu thập 5 tin theo 3 chủ đề
    print("\n[1/4] Đang quét tin tức theo 3 chuyên mục (Bia, Điện máy, Hot girl AI)...")
    top_news = collect_top_5_news()
    print(f" -> Đã thu thập thành công {len(top_news)} tin tức chất lượng cao.")

    # 2. Tạo Insight phân tích
    print("\n[2/4] Đang tổng hợp Insight điều hành và phân tích xu hướng AI...")
    insight = build_executive_insight()
    print(" -> Đã xây dựng hoàn tất chuyên mục Insight chiến lược.")

    # 3. Định dạng Telegram HTML
    print("\n[3/4] Định dạng bản tin chuẩn Telegram HTML với khung viền blockquote...")
    formatted_msg = format_telegram_html(top_news, insight)
    print(" -> Đã tạo thông điệp chuẩn HTML.")

    # 4. Gửi đến toàn bộ người nhận
    print("\n[4/4] Bắt đầu gửi bản tin tới danh sách người nhận...")
    success = send_to_recipients(formatted_msg)

    print("\n" + "=" * 70)
    if success:
        print("✨ HOÀN TẤT: Bản tin Điểm Tin Điều Hành đã được gửi thành công mỹ mãn!")
    else:
        print("⚠️ CÓ LỖI XẢY RA TRONG QUÁ TRÌNH GỬI TIN. Vui lòng kiểm tra log phía trên.")
    print("=" * 70)


if __name__ == "__main__":
    main()
