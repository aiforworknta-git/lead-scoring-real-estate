# -*- coding: utf-8 -*-
"""
================================================================================
DỊCH VỤ LẬP LỊCH TỰ ĐỘNG GỬI TIN 8H30 SÁNG HÀNG NGÀY (DAEMON SCHEDULER)
================================================================================
"""

import time
import sys
from datetime import datetime
import schedule
from send_executive_digest import main as dispatch_digest

# Đảm bảo console Windows in đúng tiếng Việt UTF-8
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass


def scheduled_job():
    print(f"\n[⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Kích hoạt tác vụ gửi bản tin 8h30 sáng...")
    try:
        dispatch_digest()
    except Exception as e:
        print(f"❌ Lỗi khi thực thi tác vụ: {e}")


def main():
    target_time = "08:30"
    print("=" * 65)
    print("⏰ HỆ THỐNG LẬP LỊCH GỬI TIN TỰ ĐỘNG (PYTHON SCHEDULER DAEMON)")
    print(f"🎯 Lịch trình: Tự động gửi vào đúng lúc {target_time} sáng hàng ngày")
    print("📌 Chuyên mục: 5 tin AI (Bia, Điện máy, Hot girl AI) + Insight điều hành")
    print("=" * 65)

    # Đăng ký lịch chạy vào 08:30 hàng ngày
    schedule.every().day.at(target_time).do(scheduled_job)

    print(f"✅ Đang chạy nền... Hệ thống sẽ tự kích hoạt lúc {target_time} sáng.")
    print("👉 Nhấn Ctrl+C để dừng dịch vụ.")

    while True:
        schedule.run_pending()
        time.sleep(30)


if __name__ == "__main__":
    main()
