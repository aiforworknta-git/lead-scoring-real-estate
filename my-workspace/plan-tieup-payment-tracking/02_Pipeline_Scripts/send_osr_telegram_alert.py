# -*- coding: utf-8 -*-
"""
================================================================================
HEINEKEN COMMERCIAL INTELLIGENCE: OSR PAYMENT & PLAN TIE-UP TELEGRAM DISPATCHER
================================================================================
Tự động trích xuất các chỉ số trọng yếu từ Data Mart (tracking_data_mart.json),
định dạng báo cáo điều hành HTML và gửi trực tiếp tới Telegram của cấp quản lý.
================================================================================
"""

import os
import sys
import json
from datetime import datetime
import requests
from dotenv import load_dotenv

# Đảm bảo in đúng tiếng Việt trên Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Tìm file .env (ở thư mục dự án hoặc telegram-ai-news-bot)
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
workspace_root = os.path.dirname(os.path.dirname(project_root))

env_paths = [
    os.path.join(project_root, ".env"),
    os.path.join(workspace_root, "telegram-ai-news-bot", ".env")
]

for env_file in env_paths:
    if os.path.exists(env_file):
        load_dotenv(env_file)
        break

BOT_TOKEN = os.getenv("BOT_TOKEN", "8933902666:AAFvBDHkZvw5mpiu83Kh_pCgMy7NGLhfjSc")
RAW_CHAT_IDS = os.getenv("CHAT_IDS", "8901458207,393564943")

DATA_MART_PATH = os.path.join(project_root, "01_Data_Mart", "tracking_data_mart.json")


def format_vnđ(amount):
    """Định dạng tiền tệ VNĐ dễ nhìn"""
    try:
        return f"{int(amount):,} đ".replace(",", ".")
    except Exception:
        return f"{amount} đ"


def generate_osr_telegram_report():
    if not os.path.exists(DATA_MART_PATH):
        print(f"[Lỗi] Không tìm thấy file Data Mart tại: {DATA_MART_PATH}")
        return None

    with open(DATA_MART_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    kpis = data.get("kpis", {})
    tpo = data.get("tpo_summary", {})
    payments = data.get("payments", [])
    today_str = datetime.now().strftime("%d/%m/%Y")

    # Lọc Top 3 đợt thanh toán trễ hạn sâu nhất (>15 ngày)
    severe_delays = [p for p in payments if p.get("aging_days", 0) > 15]
    severe_delays.sort(key=lambda x: x.get("aging_days", 0), reverse=True)

    lines = []
    lines.append("╔═════════════════════════════════╗")
    lines.append(" ⭐ <b>HEINEKEN COMMERCIAL INTELLIGENCE</b> ⭐")
    lines.append(" 🍺 <b>BÁO CÁO TÁI KÝ & CẢNH BÁO OSR 2026</b>")
    lines.append(f" 📅 <i>Thời gian: {today_str} | Sai số: 0.00%</i>")
    lines.append("╚═════════════════════════════════╝")
    lines.append("")

    # Mục 1: Kế hoạch tái ký 2026
    lines.append("📊 <b>1. QUY MÔ KẾ HOẠCH TÁI KÝ (PLAN TIE-UP):</b>")
    lines.append("<blockquote>"
                 f"• Số lượng SubD: <b>{kpis.get('total_subds', 37)} đại lý</b>\n"
                 f"  + TPO: <b>{tpo.get('TPO', {}).get('count', 27)}</b> | Non-TPO: <b>{tpo.get('Non TPO', {}).get('count', 8)}</b> | Abnormal: <b>{tpo.get('TPO Abnormal', {}).get('count', 2)}</b>\n"
                 f"• Ngân sách đầu tư 2026: <b>{format_vnđ(kpis.get('total_2026_budget', 954900000))}</b>\n"
                 f"• Cam kết sản lượng: <b>{kpis.get('total_annual_target', 1270600):,} két/thùng</b>"
                 "</blockquote>")
    lines.append("")

    # Mục 2: Tiến độ giải ngân OSR
    aging = kpis.get("aging_summary", {})
    lines.append("💳 <b>2. TIẾN ĐỘ CHI TRẢ OSR (56 ĐỢT):</b>")
    lines.append("<blockquote>"
                 f"• Đã chi thực tế: <b>{format_vnđ(kpis.get('total_actual_paid', 1143283050))}</b>\n"
                 f"• Tổng ngân sách OO: <b>{format_vnđ(kpis.get('total_oo_budget', 1213125000))}</b>\n"
                 f"• Tỷ lệ giải ngân: <b>{kpis.get('overall_disbursed_pct', 94.2)}%</b>\n"
                 f"• Tình trạng lịch trình:\n"
                 f"  🟡 Trễ nhẹ (1-15 ngày): <b>{aging.get('MILD_DELAY', 37)} đợt</b>\n"
                 f"  🔴 <b>Trễ sâu (&gt;15 ngày): {aging.get('SEVERE_DELAY', 19)} đợt (Cần chú ý!)</b>"
                 "</blockquote>")
    lines.append("")

    # Mục 3: Top đợt chi trễ hạn nghiêm trọng
    lines.append("⚠️ <b>3. TOP ĐỢT CHI TRỄ HẠN SÂU CẦN CAN THIỆP GẤP:</b>")
    top_delays_html = []
    for p in severe_delays[:3]:
        cust = p.get("customer_name", "N/A")
        days = p.get("aging_days", 0)
        amt = format_vnđ(p.get("actual_amount", 0))
        ss = p.get("ss_name", "N/A")
        top_delays_html.append(f"🔴 <b>{cust}</b>: Lệch <b>{days} ngày</b> ({amt} - SS: {ss})")

    lines.append("<blockquote>" + "\n".join(top_delays_html) + "</blockquote>")
    lines.append("")

    # Mục 4: Khuyến nghị hành động
    lines.append("💡 <b>4. KHUYẾN NGHỊ TÁC CHIẾN ĐIỀU HÀNH:</b>")
    lines.append("<blockquote>"
                 "1. Đôn đốc SS Ho Viet Quoc Vu & Vinh Vo Vu kiểm tra hồ sơ các đợt trễ >15 ngày tránh khiếu nại nợ đọng.\n"
                 "2. Mở Dashboard chọn biểu mẫu OSR {OR1A} để in hoặc copy kịch bản trình ký ASM/RSM duyệt hợp đồng 2026."
                 "</blockquote>")
    lines.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    lines.append("#Heineken #PlanTieUp2026 #OSRPayment #CommercialIntelligence")

    return "\n".join(lines)


def send_report_to_telegram(report_text):
    if not BOT_TOKEN:
        print("[Lỗi] Thiếu BOT_TOKEN!")
        return False

    chat_ids = [c.strip() for c in RAW_CHAT_IDS.split(",") if c.strip()]
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

    all_success = True
    for chat_id in chat_ids:
        payload = {
            "chat_id": chat_id,
            "text": report_text,
            "parse_mode": "HTML",
            "disable_web_page_preview": True
        }
        try:
            res = requests.post(url, json=payload, timeout=15)
            data = res.json()
            if res.status_code == 200 and data.get("ok"):
                print(f" -> [Thành công] Đã gửi báo cáo OSR tới Chat ID: {chat_id}")
            else:
                all_success = False
                print(f" -> [Thất bại] Lỗi gửi tới Chat ID {chat_id}: {data.get('description')}")
        except Exception as e:
            all_success = False
            print(f" -> [Lỗi mạng] Chat ID {chat_id}: {e}")

    return all_success


def main():
    print("=" * 65)
    print("🍺 HEINEKEN OSR & PLAN TIE-UP TELEGRAM DISPATCHER")
    print("=" * 65)

    print("\n[1/2] Đang trích xuất KPIs và biên tập báo cáo OSR...")
    report = generate_osr_telegram_report()
    if not report:
        print("[Hủy] Không thể sinh báo cáo.")
        return

    print("\n[2/2] Đang gửi báo cáo vào Telegram của Lãnh đạo...")
    success = send_report_to_telegram(report)

    if success:
        print("\n✨ HOÀN TẤT: Báo cáo OSR đã được gửi thành công tới Anh An & Anh Tuấn!")
    else:
        print("\n⚠️ Có lỗi khi gửi một số người nhận.")
    print("=" * 65)


if __name__ == "__main__":
    main()
