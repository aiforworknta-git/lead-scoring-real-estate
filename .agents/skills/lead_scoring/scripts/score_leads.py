#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI4A Lead Scoring Engine for Real Estate (Chấm điểm khách hàng Bất Động Sản)
Được phát triển theo chuẩn nghiệp vụ AI4A - Agentic AI with Google Antigravity.
"""

import sys
import os
import csv
import re
import argparse
from typing import Dict, List, Tuple, Any

# Hỗ trợ hiển thị tiếng Việt mượt mà trên môi trường Windows Terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')


# ==========================================
# TỪ KHÓA & QUY TẮC NGHIỆP VỤ (BUSINESS RULES)
# ==========================================

VIP_PLUS_50_RULES = [
    {
        "category": "Ngân sách lớn / Tài chính mạnh",
        "keywords": [
            "trên 20 tỷ", "trên 30 tỷ", "20 tỷ trở lên", "30 tỷ",
            "tài chính cực mạnh", "tài chính mạnh", "ngân sách không thành vấn đề",
            "thanh toán thẳng", "tiền mặt sẵn"
        ]
    },
    {
        "category": "Loại hình cao cấp & Quy mô lớn",
        "keywords": [
            "biệt thự đơn lập", "penthouse", "shophouse mặt đường lớn",
            "quỹ đất công nghiệp", "sàn văn phòng diện tích lớn", "trên 2000m2",
            "hồ bơi riêng", "thang máy riêng"
        ]
    },
    {
        "category": "Vị trí đắc địa (Mua / Đầu tư)",
        "keywords": [
            "ven sông", "vinhomes ocean park", "phú mỹ hưng", "khu đông", "mua quận 1", "nhà quận 1 trên"
        ]
    },
    {
        "category": "Đối tượng khách hàng VIP",
        "keywords": [
            "chủ doanh nghiệp lớn", "chủ doanh nghiệp", "nhà đầu tư chuyên nghiệp",
            "mua sỉ", "gom sỉ", "5-10 căn", "đã từng mua nhiều dự án"
        ]
    },
    {
        "category": "Tính cấp thiết & Pháp lý cao",
        "keywords": [
            "pháp lý chuẩn 100%", "muốn gặp trực tiếp chủ đầu tư",
            "cần gặp trực tiếp giám đốc dự án"
        ]
    }
]


NEGATIVE_MINUS_50_RULES = [
    {
        "category": "Yêu cầu phi thực tế / Ngân sách ảo",
        "keywords": [
            "nhà q1 giá 1 tỷ", "nhà quận 1 giá 1-2 tỷ", "thuê nguyên căn giá 2 triệu",
            "sân vườn hồ bơi giá vài trăm triệu", "yêu cầu phi thực tế", "ngân sách rất thấp"
        ]
    },
    {
        "category": "Không có nhu cầu / Dữ liệu rác",
        "keywords": [
            "nhầm số", "không có nhu cầu", "dữ liệu cũ", "ngành khác trộn vào"
        ]
    },
    {
        "category": "Khách không thiện chí",
        "keywords": [
            "hỏi giá cho vui", "chưa có ý định mua", "thái độ không hợp tác"
        ]
    },
    {
        "category": "Spam / Quảng cáo dịch vụ khác",
        "keywords": [
            "bảo hiểm", "vay vốn", "mời chào dịch vụ", "quảng cáo ngược lại"
        ]
    },
    {
        "category": "Thông tin liên lạc lỗi / Không kết nối",
        "keywords": [
            "thuê bao", "gọi nhiều lần không bắt máy", "không phản hồi zalo"
        ]
    }
]

MID_TIER_RULES = [
    {
        "category": "Nhà phố liền kề nội thành (8-10 tỷ)",
        "keywords": ["nhà phố liền kề", "khu vực nội thành", "8-10 tỷ", "cân nhắc giữa 2 dự án"],
        "bonus": 25,
        "desc": "Nhà phố nội thành, tài chính 8-10 tỷ, đang so sánh dự án"
    },
    {
        "category": "Căn hộ 2PN gia đình trẻ (4-5 tỷ)",
        "keywords": ["căn hộ 2pn", "quận 7", "4-5 tỷ", "vay ngân hàng 70%", "xem nhà mẫu vào cuối tuần"],
        "bonus": 22,
        "desc": "Căn hộ 2PN an cư, tài chính 4-5 tỷ, xem nhà mẫu cuối tuần"
    },
    {
        "category": "Mặt bằng kinh doanh thương mại Q1",
        "keywords": ["thuê mặt bằng kinh doanh spa", "quận 1", "80-100m2", "dưới 50 triệu", "hợp đồng dài hạn"],
        "bonus": 18,
        "desc": "Thuê mặt bằng spa Quận 1 dài hạn"
    },
    {
        "category": "Đất nền vùng ven đầu tư tích sản (2-3 tỷ)",
        "keywords": ["đất nền vùng ven", "long an", "đồng nai", "2-3 tỷ", "sổ hồng riêng", "không dính quy hoạch"],
        "bonus": 15,
        "desc": "Đất nền vùng ven 2-3 tỷ, pháp lý sổ hồng riêng"
    }
]

def score_single_lead(lead_desc: str) -> Dict[str, Any]:
    """
    Chấm điểm 1 khách hàng dựa trên mô tả nhu cầu.
    Base score: 50.
    """
    text_lower = lead_desc.lower()
    
    # 1. Kiểm tra tiêu chí phạt trừ 50
    minus_triggers = []
    for rule in NEGATIVE_MINUS_50_RULES:
        for kw in rule["keywords"]:
            if kw in text_lower:
                minus_triggers.append((rule["category"], kw))
                break
                
    # 2. Kiểm tra tiêu chí thưởng cộng 50
    plus_triggers = []
    for rule in VIP_PLUS_50_RULES:
        for kw in rule["keywords"]:
            if kw in text_lower:
                plus_triggers.append((rule["category"], kw))
                break
                
    # 3. Tính toán điểm số
    base_score = 50
    evidence = []
    
    if minus_triggers:
        # Bị phạt nặng
        final_score = max(0, base_score - 50)
        # Nếu có nhiều dấu hiệu tiêu cực, trừ thêm
        if len(minus_triggers) > 1:
            final_score = max(0, final_score - 10)
        tier = "COLD"
        categories = [t[0] for t in minus_triggers]
        keywords = [t[1] for t in minus_triggers]
        reason = f"Dính tiêu chí loại trừ: {', '.join(categories)}"
        action = "Đưa vào danh sách hủy / Blacklist CRM / Chặn số spam"
        sla = 0
    elif plus_triggers:
        # Được cộng 50 điểm VIP
        final_score = min(100, base_score + 50)
        tier = "HOT"
        categories = [t[0] for t in plus_triggers]
        keywords = [t[1] for t in plus_triggers]
        reason = f"Đạt chuẩn VIP Siêu Tiềm Năng: {', '.join(categories)}"
        action = "Giao Giám đốc dự án / Top Senior Broker gọi trong 15-30 phút"
        sla = 15
    else:
        # Nhóm tầm trung (WARM)
        mid_matched = False
        final_score = base_score
        reason_parts = []
        keywords = []
        
        for rule in MID_TIER_RULES:
            matched_kws = [kw for kw in rule["keywords"] if kw in text_lower]
            if len(matched_kws) >= 2:
                final_score += rule["bonus"]
                reason_parts.append(rule["desc"])
                keywords.extend(matched_kws[:3])
                mid_matched = True
                break
                
        final_score = min(78, max(50, final_score))
        tier = "WARM"
        reason = f"Nhu cầu thực: {', '.join(reason_parts)}" if reason_parts else "Khách hàng có nhu cầu cơ bản"
        action = "Giao Chuyên viên tư vấn liên hệ và gửi thông tin qua Zalo trong 24h"
        sla = 1440 # 24h

    return {
        "score": final_score,
        "tier": tier,
        "reason": reason,
        "keywords": ", ".join(keywords),
        "action": action,
        "sla_minutes": sla
    }

def process_csv(input_path: str, output_path: str):
    """
    Xử lý chấm điểm hàng loạt từ file CSV.
    """
    if not os.path.exists(input_path):
        print(f"[ERROR] Không tìm thấy file: {input_path}")
        sys.exit(1)
        
    leads = []
    with open(input_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)
            
    total = len(leads)
    hot_count = 0
    warm_count = 0
    cold_count = 0
    
    scored_leads = []
    for lead in leads:
        lead_id = lead.get("id", "")
        name = lead.get("ten_khach", "")
        phone = lead.get("sdt", "")
        desc = lead.get("nhu_cau_mo_ta", "")
        
        result = score_single_lead(desc)
        tier = result["tier"]
        
        if tier == "HOT":
            hot_count += 1
        elif tier == "WARM":
            warm_count += 1
        else:
            cold_count += 1
            
        scored_leads.append({
            "id": lead_id,
            "ten_khach": name,
            "sdt": phone,
            "nhu_cau_mo_ta": desc,
            "diem_so": result["score"],
            "phan_hang": result["tier"],
            "ly_do_chi_tiet": result["reason"],
            "tu_khoa_nhan_dien": result["keywords"],
            "hanh_dong_sales": result["action"],
            "sla_phut": result["sla_minutes"]
        })
        
    # Ghi file kết quả
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    fieldnames = [
        "id", "ten_khach", "sdt", "nhu_cau_mo_ta",
        "diem_so", "phan_hang", "ly_do_chi_tiet",
        "tu_khoa_nhan_dien", "hanh_dong_sales", "sla_phut"
    ]
    with open(output_path, mode="w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(scored_leads)
        
    # Báo cáo tổng kết
    print("=" * 65)
    print("    AI4A LEAD SCORING ENGINE - KẾT QUẢ ĐỐI SOÁT TOÀN DIỆN")
    print("=" * 65)
    print(f"Tổng số khách hàng phân tích: {total} leads")
    print("-" * 65)
    print(f"🔥 HOT  (Siêu tiềm năng / VIP) : {hot_count:>4} leads ({hot_count/total*100:>5.1f}%) -> SLA: 15-30 phút")
    print(f"⚡ WARM (Nhu cầu thực / Đang lọc): {warm_count:>4} leads ({warm_count/total*100:>5.1f}%) -> SLA: 24 giờ")
    print(f"❄️ COLD (Rác / Spam / Lỗi số)   : {cold_count:>4} leads ({cold_count/total*100:>5.1f}%) -> Đã lọc trừ")
    print("-" * 65)
    print(f"-> Đã xuất file đối soát chuẩn UTF-8 tại: {output_path}")
    print("=" * 65)

def main():
    parser = argparse.ArgumentParser(description="Chấm điểm khách hàng tiềm năng Bất Động Sản")
    parser.add_argument("--input", default="my-workspace/sample_leads_clean.csv", help="Đường dẫn file CSV đầu vào")
    parser.add_argument("--output", default="my-workspace/scored_leads_500.csv", help="Đường dẫn file CSV đầu ra")
    args = parser.parse_args()
    
    process_csv(args.input, args.output)

if __name__ == "__main__":
    main()
