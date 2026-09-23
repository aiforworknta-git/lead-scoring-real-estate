#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
AURUM REAL ESTATE INTELLIGENCE & LEAD SCORING HUB (PREMIUM EXECUTIVE SUITE)
Được phát triển theo chuẩn nghiệp vụ AI4A - Agentic AI with Google Antigravity
Tích hợp: Visual Analytics Dashboard, st.data_editor Human-in-the-Loop,
AI Scoring Agent Engine, Thẻ Bàn Giao Zalo 1-Chạm & Nhận Diện Thương Hiệu Cao Cấp
=============================================================================
"""

import os
import sys
import pandas as pd
import streamlit as st
import altair as alt

# ==========================================
# CẤU HÌNH TRANG STREAMLIT
# ==========================================
st.set_page_config(
    page_title="Aurum Group | AI Lead Scoring Intelligence",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ==========================================
# CSS CUSTOM: LUXURY DARK OBSIDIAN & GLASSMORPHISM
# ==========================================
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Cinzel:wght@600;700;900&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Gradient Background mờ ảo */
    .stApp {
        background: radial-gradient(circle at 10% 20%, #0d1527 0%, #070b14 90%);
        color: #e2e8f0;
    }

    /* Hero Brand Banner */
    .hero-container {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(212, 175, 55, 0.3);
        box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.15);
        margin-bottom: 24px;
        background: #0b1120;
    }

    .hero-overlay {
        background: linear-gradient(90deg, rgba(7, 11, 20, 0.95) 0%, rgba(11, 17, 32, 0.85) 50%, rgba(11, 17, 32, 0.4) 100%);
        padding: 32px 40px;
    }

    .brand-title {
        font-family: 'Cinzel', serif;
        font-size: 28px;
        font-weight: 800;
        letter-spacing: 2px;
        background: linear-gradient(90deg, #FDE68A 0%, #D4AF37 50%, #B45309 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        text-transform: uppercase;
    }

    .brand-subtitle {
        font-size: 14px;
        color: #94a3b8;
        letter-spacing: 1px;
        margin-top: 6px;
    }

    /* Executive KPI Cards */
    .kpi-box {
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 18px 22px;
        position: relative;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .kpi-box:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4);
    }
    .kpi-box-hot {
        border-top: 3px solid #ef4444;
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.15);
    }
    .kpi-box-warm {
        border-top: 3px solid #3b82f6;
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
    }
    .kpi-box-cold {
        border-top: 3px solid #64748b;
    }
    .kpi-box-total {
        border-top: 3px solid #d4af37;
        box-shadow: 0 4px 20px rgba(212, 175, 55, 0.15);
    }
    .kpi-box-rate {
        border-top: 3px solid #10b981;
        box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
    }

    .kpi-title {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #94a3b8;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .kpi-value {
        font-size: 28px;
        font-weight: 800;
        color: #f8fafc;
        margin: 6px 0;
    }
    .kpi-desc {
        font-size: 11px;
        color: #64748b;
    }

    /* Badges */
    .badge-pill {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.5px;
    }
    .badge-hot {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.4);
    }
    .badge-warm {
        background: rgba(59, 130, 246, 0.2);
        color: #93c5fd;
        border: 1px solid rgba(59, 130, 246, 0.4);
    }
    .badge-cold {
        background: rgba(100, 116, 139, 0.2);
        color: #cbd5e1;
        border: 1px solid rgba(100, 116, 139, 0.4);
    }

    /* Styled Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 12px;
        background: rgba(15, 23, 42, 0.6);
        padding: 6px 10px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        padding: 8px 18px;
        font-weight: 600;
        font-size: 13px;
        color: #94a3b8;
        transition: all 0.2s;
    }
    .stTabs [aria-selected="true"] {
        background: rgba(212, 175, 55, 0.15) !important;
        color: #FDE68A !important;
        border: 1px solid rgba(212, 175, 55, 0.3) !important;
    }

    /* Card tin nhắn Zalo Handoff */
    .zalo-terminal {
        background: #090e17;
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-left: 5px solid #3b82f6;
        border-radius: 10px;
        padding: 20px;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.7;
        color: #e2e8f0;
        white-space: pre-wrap;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
    }

    /* Section Headers */
    .section-header {
        font-size: 18px;
        font-weight: 700;
        color: #f8fafc;
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 20px 0 10px 0;
    }
</style>
""", unsafe_allow_html=True)


# ==========================================
# QUY TẮC NGHIỆP VỤ AI SCORING (AGENT ENGINE)
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
        "segment": "Nhà phố liền kề nội thành",
        "price": "8-10 tỷ",
        "keywords": ["nhà phố liền kề", "khu vực nội thành", "8-10 tỷ", "cân nhắc giữa 2 dự án"],
        "bonus": 25,
        "desc": "Nhà phố nội thành, tài chính 8-10 tỷ, đang so sánh dự án"
    },
    {
        "segment": "Căn hộ 2PN gia đình trẻ",
        "price": "4-5 tỷ",
        "keywords": ["căn hộ 2pn", "quận 7", "4-5 tỷ", "vay ngân hàng 70%", "xem nhà mẫu vào cuối tuần"],
        "bonus": 22,
        "desc": "Căn hộ 2PN an cư, tài chính 4-5 tỷ, xem nhà mẫu cuối tuần"
    },
    {
        "segment": "Mặt bằng kinh doanh thương mại",
        "price": "Dưới 50tr/tháng",
        "keywords": ["thuê mặt bằng kinh doanh spa", "quận 1", "80-100m2", "dưới 50 triệu", "hợp đồng dài hạn"],
        "bonus": 18,
        "desc": "Thuê mặt bằng spa Quận 1 dài hạn"
    },
    {
        "segment": "Đất nền vùng ven tích sản",
        "price": "2-3 tỷ",
        "keywords": ["đất nền vùng ven", "long an", "đồng nai", "2-3 tỷ", "sổ hồng riêng", "không dính quy hoạch"],
        "bonus": 15,
        "desc": "Đất nền vùng ven 2-3 tỷ, pháp lý sổ hồng riêng"
    }
]

def run_ai_scoring_engine(lead_desc: str) -> dict:
    """Agentic AI Scoring Engine theo ma trận BANT-E."""
    if not isinstance(lead_desc, str) or not lead_desc.strip():
        return {
            "score": 0, "tier": "COLD", "segment": "Chưa xác định",
            "reason": "Thiếu mô tả nhu cầu", "keywords": "",
            "action": "Cần khảo sát lại", "sla": 0
        }

    text_lower = lead_desc.lower()
    
    # 1. Quét tiêu chí trừ 50
    minus_triggers = []
    for rule in NEGATIVE_MINUS_50_RULES:
        for kw in rule["keywords"]:
            if kw in text_lower:
                minus_triggers.append((rule["category"], kw))
                break

    # 2. Quét tiêu chí cộng 50 VIP
    plus_triggers = []
    for rule in VIP_PLUS_50_RULES:
        for kw in rule["keywords"]:
            if kw in text_lower:
                plus_triggers.append((rule["category"], kw))
                break

    base_score = 50

    if minus_triggers:
        score = max(0, base_score - 50)
        if len(minus_triggers) > 1:
            score = max(0, score - 10)
        tier = "COLD"
        categories = [t[0] for t in minus_triggers]
        keywords = [t[1] for t in minus_triggers]
        
        if "thuê bao" in text_lower:
            segment = "Lỗi liên lạc (Thuê bao)"
        elif "nhầm số" in text_lower or "dữ liệu cũ" in text_lower:
            segment = "Dữ liệu cũ / Nhầm số"
        elif "bảo hiểm" in text_lower:
            segment = "Spam dịch vụ"
        elif "hỏi giá cho vui" in text_lower or "nhà q1 giá 1 tỷ" in text_lower:
            segment = "Phi thực tế / Không thiện chí"
        else:
            segment = "Không có nhu cầu"

        reason = f"Dính tiêu chí loại trừ: {', '.join(categories)}"
        action = "Đưa vào danh sách hủy / Blacklist CRM / Chặn số"
        sla = 0
    elif plus_triggers:
        score = min(100, base_score + 50)
        tier = "HOT"
        categories = [t[0] for t in plus_triggers]
        keywords = [t[1] for t in plus_triggers]

        if "penthouse" in text_lower:
            segment = "Penthouse Hạng Sang"
        elif "biệt thự" in text_lower:
            segment = "Biệt thự Đơn Lập Ven Sông"
        elif "shophouse" in text_lower:
            segment = "Mua sỉ Shophouse Mặt Đường"
        elif "công nghiệp" in text_lower or "2000m2" in text_lower:
            segment = "Đất Công Nghiệp / Sàn VP Lớn"
        else:
            segment = "Khách Hàng VIP Siêu Tiềm Năng"

        reason = f"Đạt chuẩn VIP Siêu Tiềm Năng: {', '.join(categories)}"
        action = "Giao Giám đốc dự án / Top Senior Broker liên hệ trong 15-30 phút"
        sla = 15
    else:
        score = base_score
        reason_parts = []
        keywords = []
        segment = "Nhu Cầu Ở Thực / An Cư"

        for rule in MID_TIER_RULES:
            matched = [kw for kw in rule["keywords"] if kw in text_lower]
            if len(matched) >= 2:
                score += rule["bonus"]
                segment = rule["segment"]
                reason_parts.append(rule["desc"])
                keywords.extend(matched[:3])
                break

        score = min(78, max(50, score))
        tier = "WARM"
        reason = f"Nhu cầu thực: {', '.join(reason_parts)}" if reason_parts else "Nhu cầu cơ bản đang khảo sát"
        action = "Giao Chuyên viên tư vấn liên hệ và gửi thông tin qua Zalo trong 24h"
        sla = 1440

    return {
        "score": score,
        "tier": tier,
        "segment": segment,
        "reason": reason,
        "keywords": ", ".join(keywords),
        "action": action,
        "sla": sla
    }

def generate_zalo_card(row: pd.Series) -> str:
    """Tạo mẫu tin nhắn Zalo 1-chạm chuẩn Sales Handoff."""
    name = row.get("ten_khach", "Quý khách")
    phone = row.get("sdt", "")
    score = row.get("diem_so", 0)
    tier = row.get("phan_hang", "WARM")
    desc = row.get("nhu_cau_mo_ta", "")
    keywords = row.get("tu_khoa_nhan_dien", "")
    segment = row.get("phan_khuc", "Bất Động Sản")

    tier_emoji = "🔥" if "HOT" in str(tier) else ("⚡" if "WARM" in str(tier) else "❄️")
    sla_text = "Trong vòng 15 PHÚT" if "HOT" in str(tier) else "Trong vòng 24 GIỜ"

    if "penthouse" in desc.lower():
        hook = f"Em chào Anh/Chị {name}, em nhận được yêu cầu của Anh/Chị về dòng Penthouse độc bản có hồ bơi và thang máy riêng. Dự án bên em hiện có 2 căn góc tầng cao nhất view sông trực diện, em xin phép gửi video 3D và bảng giá qua Zalo chị nhé!"
    elif "biệt thự" in desc.lower():
        hook = f"Em chào Anh/Chị {name}, em phụ trách quỹ biệt thự đơn lập ven sông phân khu VIP nhất. Em xin gửi thông tin mặt bằng phong thủy hướng Đông Nam qua Zalo để Anh/Chị xem trước ạ!"
    elif "shophouse" in desc.lower():
        hook = f"Em chào Anh {name}, về gói gom sỉ shophouse mặt đường lớn cam kết thuê lại, Giám đốc khối Dự án của bên em muốn hẹn trao đổi trực tiếp với Anh 5 phút để chốt chính sách chiết khấu sỉ từ CĐT ạ!"
    elif "căn hộ" in desc.lower() or "2pn" in desc.lower():
        hook = f"Em chào Chị {name}, em thấy Chị đang tìm căn hộ 2PN Quận 7 và muốn ghé xem nhà mẫu cuối tuần này. Bên em đang có chính sách hỗ trợ lãi suất 0% 24 tháng cho khách vay 70%, em gửi Chị thư mời VIP nhé!"
    elif "spa" in desc.lower() or "mặt bằng" in desc.lower():
        hook = f"Em chào Anh/Chị {name}, em đang nắm 1 mặt bằng spa Quận 1 80-100m2 giá dưới 50tr đúng ngân sách và cam kết ký dài hạn 5 năm. Chiều nay Anh/Chị tiện qua xem thực tế không ạ?"
    else:
        hook = f"Em chào Anh/Chị {name}, em nhận được thông tin tư vấn Bất Động Sản từ Anh/Chị và xin gửi thông tin chi tiết qua Zalo ạ!"

    card = f"""{tier_emoji} [BÀN GIAO LEAD {tier} - AURUM REAL ESTATE] {tier_emoji}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Khách hàng: {name}
📱 Số điện thoại: 0{phone} (Bấm gọi ngay)
⭐ Điểm số AI: {score}/100 [HẠNG: {tier}]
🏢 Phân khúc: {segment}
⏱️ Thời hạn xử lý (SLA): {sla_text}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Nhu cầu ghi nhận:
"{desc}"

💎 Từ khóa đắt giá: {keywords if keywords else "Nhu cầu tổng quát"}

🗣️ Kịch bản mở lời gợi ý (Ice-breaker Hook):
"{hook}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 Trạng thái duyệt: {row.get('trang_thai_duyet', 'Chờ duyệt')} | Phụ trách: {row.get('sales_phu_trach', 'Chưa phân bổ')}"""
    return card


# ==========================================
# KHỞI TẠO STATE & NẠP DỮ LIỆU AN TOÀN
# ==========================================

def get_sample_data_path() -> str:
    """Tìm kiếm file dữ liệu mẫu ở các đường dẫn khả dĩ."""
    candidates = [
        "sample_leads_clean.csv",
        "my-workspace/sample_leads_clean.csv",
        "my-workspace/sample_leads.csv",
        "sample_leads.csv",
        os.path.join(os.path.dirname(__file__), "sample_leads_clean.csv"),
        os.path.join(os.path.dirname(__file__), "my-workspace", "sample_leads_clean.csv"),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return "my-workspace/sample_leads_clean.csv"

def find_asset(filename: str):
    """Tìm kiếm file tài nguyên ảnh ở các thư mục khả dĩ."""
    candidates = [
        os.path.join("assets", filename),
        os.path.join("my-workspace", "assets", filename),
        os.path.join(os.path.dirname(__file__), "assets", filename),
        os.path.join(os.path.dirname(__file__), "my-workspace", "assets", filename),
        filename
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None

def ensure_leads_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Đảm bảo mọi cột dữ liệu cần thiết luôn tồn tại 100%, chống lỗi KeyError trên Streamlit Cloud."""
    if df is None or not isinstance(df, pd.DataFrame) or df.empty:
        return df

    if "phan_khuc" not in df.columns:
        if "nhu_cau_mo_ta" in df.columns:
            df["phan_khuc"] = df["nhu_cau_mo_ta"].apply(lambda d: run_ai_scoring_engine(str(d))["segment"])
        else:
            df["phan_khuc"] = "Bất Động Sản"

    if "diem_so" not in df.columns:
        df["diem_so"] = 50
    if "phan_hang" not in df.columns:
        df["phan_hang"] = "WARM"
    if "trang_thai_duyet" not in df.columns:
        df["trang_thai_duyet"] = "⏳ Chờ duyệt"
    if "sales_phu_trach" not in df.columns:
        df["sales_phu_trach"] = "Chưa phân bổ"
    if "ghi_chu_sales" not in df.columns:
        df["ghi_chu_sales"] = ""
    if "sla_phut" not in df.columns:
        df["sla_phut"] = 24
    if "ly_do_chi_tiet" not in df.columns:
        df["ly_do_chi_tiet"] = "Nhu cầu cơ bản"
    if "tu_khoa_nhan_dien" not in df.columns:
        df["tu_khoa_nhan_dien"] = ""
    if "hanh_dong_sales" not in df.columns:
        df["hanh_dong_sales"] = "Chuyên viên tư vấn liên hệ"
    if "id" not in df.columns:
        df["id"] = range(1, len(df) + 1)
    if "ten_khach" not in df.columns:
        df["ten_khach"] = [f"Khách hàng #{i}" for i in range(1, len(df) + 1)]
    if "sdt" not in df.columns:
        df["sdt"] = ""

    return df

def load_initial_data(filepath: str = None) -> pd.DataFrame:
    """Nạp dữ liệu mẫu và tính điểm AI."""
    if not filepath:
        filepath = get_sample_data_path()

    if os.path.exists(filepath):
        df = pd.read_csv(filepath, encoding="utf-8-sig")
    else:
        df = pd.DataFrame([
            {"id": 1, "ten_khach": "Lê Anh Lan", "sdt": "964591036", "nhu_cau_mo_ta": "Tìm Penthouse hồ bơi riêng, ngân sách không thành vấn đề."},
            {"id": 2, "ten_khach": "Hồ Hồng Linh", "sdt": "848475144", "nhu_cau_mo_ta": "Khách hàng nhầm số, không có nhu cầu BĐS."},
            {"id": 3, "ten_khach": "Lý Đức Cường", "sdt": "953430096", "nhu_cau_mo_ta": "Căn hộ 2PN Quận 7, tài chính 4-5 tỷ, vay ngân hàng 70%."}
        ])

    scored_rows = []
    for _, row in df.iterrows():
        desc = str(row.get("nhu_cau_mo_ta", ""))
        ai_res = run_ai_scoring_engine(desc)
        scored_rows.append({
            "id": row.get("id"),
            "ten_khach": row.get("ten_khach", ""),
            "sdt": str(row.get("sdt", "")),
            "nhu_cau_mo_ta": desc,
            "diem_so": ai_res["score"],
            "phan_hang": ai_res["tier"],
            "phan_khuc": ai_res["segment"],
            "ly_do_chi_tiet": ai_res["reason"],
            "tu_khoa_nhan_dien": ai_res["keywords"],
            "hanh_dong_sales": ai_res["action"],
            "sla_phut": ai_res["sla"],
            "trang_thai_duyet": "⏳ Chờ duyệt",
            "sales_phu_trach": "Chưa phân bổ",
            "ghi_chu_sales": ""
        })

    return ensure_leads_dataframe(pd.DataFrame(scored_rows))

# Tự động phát hiện và reset session_state nếu dữ liệu cũ thiếu cột phan_khuc
if "df_leads" not in st.session_state or "phan_khuc" not in st.session_state.df_leads.columns:
    st.session_state.df_leads = load_initial_data()
else:
    st.session_state.df_leads = ensure_leads_dataframe(st.session_state.df_leads)



# ==========================================
# THANH BÊN (SIDEBAR) & BRANDING
# ==========================================

with st.sidebar:
    logo_path = find_asset("logo_luxury_real_estate.jpg")
    if logo_path and os.path.exists(logo_path):
        st.image(logo_path, use_container_width=True)
    else:
        st.markdown("<h2 style='color:#D4AF37;text-align:center;'>AURUM GROUP</h2>", unsafe_allow_html=True)

    st.markdown("""
    <div style='text-align: center; margin-bottom: 20px;'>
        <span class='badge-pill badge-hot'>AI-POWERED</span>
        <span class='badge-pill badge-warm'>AGENTIC SUITE</span>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("---")

    st.subheader("📂 Nguồn Dữ Liệu")
    data_source = st.radio(
        "Chọn nguồn nạp:",
        ["Dữ liệu 500 Leads chuẩn", "Tải lên tệp CSV mới", "Thêm 1 lead nhanh"],
        index=0
    )

    if data_source == "Tải lên tệp CSV mới":
        uploaded_file = st.file_uploader("File CSV (cột id, ten_khach, sdt, nhu_cau_mo_ta):", type=["csv"])
        if uploaded_file is not None:
            if st.button("🚀 Nạp & Chấm Điểm AI"):
                raw_df = pd.read_csv(uploaded_file, encoding="utf-8-sig")
                scored_rows = []
                for idx, row in raw_df.iterrows():
                    desc = str(row.get("nhu_cau_mo_ta", ""))
                    ai_res = run_ai_scoring_engine(desc)
                    scored_rows.append({
                        "id": row.get("id", idx + 1),
                        "ten_khach": row.get("ten_khach", f"Khách #{idx+1}"),
                        "sdt": str(row.get("sdt", "")),
                        "nhu_cau_mo_ta": desc,
                        "diem_so": ai_res["score"],
                        "phan_hang": ai_res["tier"],
                        "phan_khuc": ai_res["segment"],
                        "ly_do_chi_tiet": ai_res["reason"],
                        "tu_khoa_nhan_dien": ai_res["keywords"],
                        "hanh_dong_sales": ai_res["action"],
                        "sla_phut": ai_res["sla"],
                        "trang_thai_duyet": "⏳ Chờ duyệt",
                        "sales_phu_trach": "Chưa phân bổ",
                        "ghi_chu_sales": ""
                    })
                st.session_state.df_leads = pd.DataFrame(scored_rows)
                st.success(f"Đã xử lý xong {len(scored_rows)} khách hàng!")
                st.rerun()

    elif data_source == "Thêm 1 lead nhanh":
        with st.expander("➕ Nhập khách hàng thủ công", expanded=True):
            with st.form("quick_lead_form"):
                n_name = st.text_input("Tên khách hàng:")
                n_phone = st.text_input("Số điện thoại:")
                n_desc = st.text_area("Mô tả nhu cầu:")
                btn_add = st.form_submit_button("⚡ Quét & Thêm")
                if btn_add and n_name and n_desc:
                    ai_res = run_ai_scoring_engine(n_desc)
                    n_id = int(st.session_state.df_leads["id"].max()) + 1 if not st.session_state.df_leads.empty else 1
                    n_row = {
                        "id": n_id,
                        "ten_khach": n_name,
                        "sdt": n_phone,
                        "nhu_cau_mo_ta": n_desc,
                        "diem_so": ai_res["score"],
                        "phan_hang": ai_res["tier"],
                        "phan_khuc": ai_res["segment"],
                        "ly_do_chi_tiet": ai_res["reason"],
                        "tu_khoa_nhan_dien": ai_res["keywords"],
                        "hanh_dong_sales": ai_res["action"],
                        "sla_phut": ai_res["sla"],
                        "trang_thai_duyet": "⏳ Chờ duyệt",
                        "sales_phu_trach": "Chưa phân bổ",
                        "ghi_chu_sales": ""
                    }
                    st.session_state.df_leads = pd.concat([pd.DataFrame([n_row]), st.session_state.df_leads], ignore_index=True)
                    st.success(f"Đã thêm: {ai_res['tier']} ({ai_res['score']} điểm)!")
                    st.rerun()

    st.markdown("---")
    st.subheader("🔍 Bộ Lọc & Tìm Kiếm")
    filter_tier = st.multiselect(
        "Phân hạng AI:",
        ["HOT", "WARM", "COLD"],
        default=["HOT", "WARM", "COLD"]
    )
    filter_status = st.multiselect(
        "Trạng thái duyệt:",
        ["⏳ Chờ duyệt", "✅ Duyệt bàn giao", "🔍 Cần xác minh", "❌ Hủy / Rác"],
        default=["⏳ Chờ duyệt", "✅ Duyệt bàn giao", "🔍 Cần xác minh", "❌ Hủy / Rác"]
    )
    search_keyword = st.text_input("Tìm kiếm theo tên/SĐT/từ khóa:", placeholder="Nhập để tìm kiếm...")

    st.markdown("---")
    if st.button("🔄 Đặt lại dữ liệu gốc", use_container_width=True):
        st.session_state.df_leads = load_initial_data(get_sample_data_path())
        st.rerun()


# ==========================================
# KHU VỰC CHÍNH: BRAND HERO BANNER & KPI
# ==========================================

# 1. Hero Brand Banner Section
banner_path = find_asset("banner_luxury_real_estate.jpg")
if banner_path and os.path.exists(banner_path):
    st.image(banner_path, use_container_width=True)


st.markdown("""
<div class="hero-container">
    <div class="hero-overlay">
        <h1 class="brand-title">AURUM REAL ESTATE INTELLIGENCE HUB</h1>
        <div class="brand-subtitle">
            HỆ THỐNG ĐIỀU HÀNH & CHẤM ĐIỂM KHÁCH HÀNG TIỀM NĂNG BẤT ĐỘNG SẢN CAO CẤP • CHUẨN BANT-E & MA TRẬN 50 ĐIỂM
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# 2. Tính toán số liệu thống kê
df = st.session_state.df_leads.copy()
total_leads = len(df)
hot_count = len(df[df["phan_hang"] == "HOT"])
warm_count = len(df[df["phan_hang"] == "WARM"])
cold_count = len(df[df["phan_hang"] == "COLD"])
approved_count = len(df[df["trang_thai_duyet"] == "✅ Duyệt bàn giao"])
approval_rate = (approved_count / total_leads * 100) if total_leads else 0

# Tính toán giá trị ước tính
est_vip_val = hot_count * 25 # Ước tính 25 tỷ/deal VIP
hours_saved = round(cold_count * 25 / 60, 1) # Tiết kiệm 25p gọi/lead rác

# 3. Hàng KPI Cards sang trọng
kcol1, kcol2, kcol3, kcol4, kcol5 = st.columns(5)

with kcol1:
    st.markdown(f"""
    <div class="kpi-box kpi-box-total">
        <div class="kpi-title">📊 TỔNG TIẾP NHẬN</div>
        <div class="kpi-value">{total_leads:,}</div>
        <div class="kpi-desc">Tổng số hồ sơ trong hệ thống</div>
    </div>
    """, unsafe_allow_html=True)

with kcol2:
    st.markdown(f"""
    <div class="kpi-box kpi-box-hot">
        <div class="kpi-title">🔥 VIP / HOT LEAD</div>
        <div class="kpi-value" style="color:#ef4444;">{hot_count} <span style="font-size:16px;color:#fca5a5;">({hot_count/total_leads*100:.1f}%)</span></div>
        <div class="kpi-desc">Deal lớn ~{est_vip_val:,} Tỷ • SLA 15-30p</div>
    </div>
    """, unsafe_allow_html=True)

with kcol3:
    st.markdown(f"""
    <div class="kpi-box kpi-box-warm">
        <div class="kpi-title">⚡ TIỀM NĂNG / WARM</div>
        <div class="kpi-value" style="color:#3b82f6;">{warm_count} <span style="font-size:16px;color:#93c5fd;">({warm_count/total_leads*100:.1f}%)</span></div>
        <div class="kpi-desc">Nhu cầu ở thực & đầu tư • SLA 24h</div>
    </div>
    """, unsafe_allow_html=True)

with kcol4:
    st.markdown(f"""
    <div class="kpi-box kpi-box-cold">
        <div class="kpi-title">❄️ LỌC RÁC / COLD</div>
        <div class="kpi-value" style="color:#94a3b8;">{cold_count} <span style="font-size:16px;color:#64748b;">({cold_count/total_leads*100:.1f}%)</span></div>
        <div class="kpi-desc">Tiết kiệm ~{hours_saved} giờ Telesales</div>
    </div>
    """, unsafe_allow_html=True)

with kcol5:
    st.markdown(f"""
    <div class="kpi-box kpi-box-rate">
        <div class="kpi-title">🎯 TIẾN ĐỘ DUYỆT</div>
        <div class="kpi-value" style="color:#10b981;">{approval_rate:.1f}%</div>
        <div class="kpi-desc">Đã duyệt: {approved_count}/{total_leads} hồ sơ</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)


# ==========================================
# CẤU TRÚC TAB ĐIỀU HÀNH ĐA TẦNG
# ==========================================

tab_dash, tab_editor, tab_handoff, tab_matrix = st.tabs([
    "📊 Executive Dashboard (Thống Kê Trực Quan)",
    "📋 Human-in-the-Loop Hub (Bàn Phê Duyệt & Gán Sales)",
    "📲 Sales Handoff (Thẻ Zalo 1-Chạm & Talk-Track)",
    "🧠 AI Matrix & Audit (Bộ Tiêu Chí BANT-E)"
])


# -------------------------------------------------------------
# TAB 1: VISUAL ANALYTICS DASHBOARD
# -------------------------------------------------------------
with tab_dash:
    st.markdown('<div class="section-header">📈 Báo Cáo Phân Tích & Phân Bổ Chất Lượng Leads</div>', unsafe_allow_html=True)

    dcol1, dcol2 = st.columns([1.2, 1.8])

    with dcol1:
        st.markdown("##### 🎯 Tỷ Lệ Phân Hạng Chất Lượng Leads (Phễu Chuyển Đổi)")
        
        tier_data = pd.DataFrame([
            {"Hạng": "🔥 HOT (VIP Siêu Tiềm Năng)", "Số Lượng": hot_count, "Tỷ Lệ": round(hot_count/total_leads*100, 1), "Color": "#EF4444"},
            {"Hạng": "⚡ WARM (Nhu Cầu Thực / Đầu Tư)", "Số Lượng": warm_count, "Tỷ Lệ": round(warm_count/total_leads*100, 1), "Color": "#3B82F6"},
            {"Hạng": "❄️ COLD (Lead Rác / Thuê Bao / Ảo)", "Số Lượng": cold_count, "Tỷ Lệ": round(cold_count/total_leads*100, 1), "Color": "#64748B"}
        ])

        donut_chart = alt.Chart(tier_data).mark_arc(innerRadius=75, outerRadius=125, stroke="#0f172a", strokeWidth=2).encode(
            theta=alt.Theta(field="Số Lượng", type="quantitative"),
            color=alt.Color(field="Hạng", type="nominal", scale=alt.Scale(
                domain=["🔥 HOT (VIP Siêu Tiềm Năng)", "⚡ WARM (Nhu Cầu Thực / Đầu Tư)", "❄️ COLD (Lead Rác / Thuê Bao / Ảo)"],
                range=["#EF4444", "#3B82F6", "#64748B"]
            ), legend=alt.Legend(orient="bottom", labelColor="#cbd5e1", titleColor="#94a3b8")),
            tooltip=["Hạng", "Số Lượng", "Tỷ Lệ"]
        ).properties(height=320)

        st.altair_chart(donut_chart, use_container_width=True)

    with dcol2:
        st.markdown("##### 🏢 Phân Bổ Chi Tiết Theo Nhóm Sản Phẩm & Nhu Cầu")
        
        # Đảm bảo df luôn có cột phan_khuc
        df = ensure_leads_dataframe(df)

        if not df.empty and "phan_khuc" in df.columns:
            # Tương thích cả pandas 1.x, 2.x, 3.x
            segment_counts = df["phan_khuc"].value_counts().reset_index()
            segment_counts.columns = ["Phân Khúc", "Số Lượng"]

            bar_chart = alt.Chart(segment_counts).mark_bar(cornerRadiusTopRight=6, cornerRadiusBottomRight=6).encode(
                x=alt.X("Số Lượng:Q", title="Số Lượng Leads", axis=alt.Axis(labelColor="#94a3b8", titleColor="#94a3b8")),
                y=alt.Y("Phân Khúc:N", sort="-x", title="", axis=alt.Axis(labelColor="#f1f5f9", labelFontSize=12)),
                color=alt.Color("Số Lượng:Q", scale=alt.Scale(scheme="goldorange"), legend=None),
                tooltip=["Phân Khúc", "Số Lượng"]
            ).properties(height=320)

            st.altair_chart(bar_chart, use_container_width=True)
        else:
            st.info("Chưa có dữ liệu phân khúc để hiển thị biểu đồ.")


    st.markdown("---")

    # Bảng phân tích hiệu quả vận hành kinh doanh
    st.markdown("##### 💼 Thống Kê Hiệu Quả & Chi Phí Cơ Hội (Business Impact)")
    icol1, icol2, icol3 = st.columns(3)

    with icol1:
        st.markdown(f"""
        <div style="background:rgba(239, 68, 68, 0.08);border:1px solid rgba(239, 68, 68, 0.2);padding:18px;border-radius:12px;">
            <h4 style="color:#f87171;margin:0 0 8px 0;">👑 Phân Khúc Triệu Đô (HOT)</h4>
            <p style="font-size:13px;color:#cbd5e1;line-height:1.6;margin:0;">
                • <b>{hot_count} khách hàng</b> có năng lực tài chính từ 20-30 tỷ hoặc mua sỉ.<br>
                • Phân bổ thẳng cho Top 5% Senior Broker / GĐKD.<br>
                • <b>Cam kết SLA:</b> Gọi điện xác nhận lịch hẹn trong 15 - 30 phút.
            </p>
        </div>
        """, unsafe_allow_html=True)

    with icol2:
        st.markdown(f"""
        <div style="background:rgba(59, 130, 246, 0.08);border:1px solid rgba(59, 130, 246, 0.2);padding:18px;border-radius:12px;">
            <h4 style="color:#60a5fa;margin:0 0 8px 0;">🎯 Trụ Cột Nhu Cầu Thực (WARM)</h4>
            <p style="font-size:13px;color:#cbd5e1;line-height:1.6;margin:0;">
                • <b>{warm_count} khách hàng</b> tài chính 2-10 tỷ (Căn hộ 2PN, Nhà phố, Đất nền, Spa).<br>
                • Chuyên viên tư vấn gửi bảng tính lãi suất và layout trong 24 giờ.<br>
                • Tỷ lệ chuyển đổi chốt cọc kỳ vọng đạt <b>18% - 25%</b>.
            </p>
        </div>
        """, unsafe_allow_html=True)

    with icol3:
        st.markdown(f"""
        <div style="background:rgba(100, 116, 139, 0.08);border:1px solid rgba(100, 116, 139, 0.2);padding:18px;border-radius:12px;">
            <h4 style="color:#94a3b8;margin:0 0 8px 0;">🛡️ Lá Chắn Triệt Tiêu Lãng Phí (COLD)</h4>
            <p style="font-size:13px;color:#cbd5e1;line-height:1.6;margin:0;">
                • <b>{cold_count} liên hệ rác</b> (Thuê bao, nhầm số, spam, đòi mua nhà Q1 giá 1 tỷ).<br>
                • Tiết kiệm <b>~{hours_saved} giờ làm việc</b> cho Telesales.<br>
                • Dữ liệu đối soát chuẩn để khiếu nại hoàn tiền CPL từ Agency Marketing.
            </p>
        </div>
        """, unsafe_allow_html=True)


# -------------------------------------------------------------
# TAB 2: HUMAN-IN-THE-LOOP APPROVAL HUB (st.data_editor)
# -------------------------------------------------------------
with tab_editor:
    st.markdown('<div class="section-header">⚡ Bàn Phê Duyệt & Điều Phối Khách Hàng (Human-in-the-Loop)</div>', unsafe_allow_html=True)
    st.caption("💡 *Quản lý có thể chọn nhanh trạng thái duyệt, chỉnh sửa phân hạng hoặc gán tên Sales phụ trách trực tiếp trên bảng.*")

    # Các nút thao tác hàng loạt
    bcol1, bcol2, bcol3, bcol4 = st.columns([1.2, 1.2, 1.2, 2])

    with bcol1:
        if st.button("🔥 Duyệt Nhanh Tất Cả HOT", use_container_width=True):
            st.session_state.df_leads.loc[
                st.session_state.df_leads["phan_hang"] == "HOT", "trang_thai_duyet"
            ] = "✅ Duyệt bàn giao"
            st.session_state.df_leads.loc[
                st.session_state.df_leads["phan_hang"] == "HOT", "sales_phu_trach"
            ] = "Top Senior Broker / GĐKD"
            st.toast("Đã tự động duyệt 100% Lead HOT sang Giám đốc dự án!", icon="🔥")
            st.rerun()

    with bcol2:
        if st.button("❄️ Hủy Nhanh Tất Cả COLD", use_container_width=True):
            st.session_state.df_leads.loc[
                st.session_state.df_leads["phan_hang"] == "COLD", "trang_thai_duyet"
            ] = "❌ Hủy / Rác"
            st.toast("Đã lọc bỏ toàn bộ Lead rác / Thuê bao!", icon="❄️")
            st.rerun()

    with bcol3:
        if st.button("🔄 Quét Lại AI Toàn Bộ", use_container_width=True):
            for idx, row in st.session_state.df_leads.iterrows():
                res = run_ai_scoring_engine(str(row["nhu_cau_mo_ta"]))
                st.session_state.df_leads.at[idx, "diem_so"] = res["score"]
                st.session_state.df_leads.at[idx, "phan_hang"] = res["tier"]
                st.session_state.df_leads.at[idx, "phan_khuc"] = res["segment"]
                st.session_state.df_leads.at[idx, "ly_do_chi_tiet"] = res["reason"]
                st.session_state.df_leads.at[idx, "tu_khoa_nhan_dien"] = res["keywords"]
                st.session_state.df_leads.at[idx, "hanh_dong_sales"] = res["action"]
                st.session_state.df_leads.at[idx, "sla_phut"] = res["sla"]
            st.toast("AI đã quét lại toàn bộ dữ liệu!", icon="🚀")
            st.rerun()

    with bcol4:
        csv_data = st.session_state.df_leads.to_csv(index=False, encoding="utf-8-sig").encode("utf-8-sig")
        st.download_button(
            label="📥 Tải Xuống File Đã Duyệt (CSV UTF-8)",
            data=csv_data,
            file_name="leads_da_duyet_real_estate.csv",
            mime="text/csv",
            use_container_width=True
        )

    # Lọc dữ liệu hiển thị
    filtered_df = st.session_state.df_leads[
        (st.session_state.df_leads["phan_hang"].isin(filter_tier)) &
        (st.session_state.df_leads["trang_thai_duyet"].isin(filter_status))
    ]

    if search_keyword:
        kw = search_keyword.lower()
        filtered_df = filtered_df[
            filtered_df["ten_khach"].str.lower().str.contains(kw, na=False) |
            filtered_df["sdt"].astype(str).str.contains(kw, na=False) |
            filtered_df["nhu_cau_mo_ta"].str.lower().str.contains(kw, na=False) |
            filtered_df["phan_khuc"].str.lower().str.contains(kw, na=False) |
            filtered_df["tu_khoa_nhan_dien"].str.lower().str.contains(kw, na=False)
        ]

    # Cấu hình st.data_editor
    column_config = {
        "trang_thai_duyet": st.column_config.SelectboxColumn(
            "Trạng Thái Duyệt",
            help="Cấp quản lý duyệt bàn giao lead",
            options=["⏳ Chờ duyệt", "✅ Duyệt bàn giao", "🔍 Cần xác minh", "❌ Hủy / Rác"],
            required=True
        ),
        "sales_phu_trach": st.column_config.TextColumn("Sales Phụ Trách", help="Tên nhân viên nhận lead"),
        "phan_hang": st.column_config.SelectboxColumn(
            "Hạng AI",
            help="Phân tầng chất lượng lead",
            options=["HOT", "WARM", "COLD"],
            required=True
        ),
        "diem_so": st.column_config.ProgressColumn("Điểm AI", help="Thang 0-100", format="%d", min_value=0, max_value=100),
        "phan_khuc": st.column_config.TextColumn("Phân Khúc", disabled=True),
        "ten_khach": st.column_config.TextColumn("Tên Khách", disabled=True),
        "sdt": st.column_config.TextColumn("SĐT", disabled=True),
        "nhu_cau_mo_ta": st.column_config.TextColumn("Nhu Cầu Gốc", width="large", disabled=True),
        "ly_do_chi_tiet": st.column_config.TextColumn("Bằng Chứng AI", width="medium", disabled=True),
        "tu_khoa_nhan_dien": st.column_config.TextColumn("Từ Khóa Vàng", disabled=True),
        "ghi_chu_sales": st.column_config.TextColumn("Ghi Chú Quản Lý"),
        "sla_phut": st.column_config.NumberColumn("SLA (Phút)", disabled=True),
        "id": st.column_config.NumberColumn("ID", width="small", disabled=True)
    }

    display_cols = [
        "trang_thai_duyet", "sales_phu_trach", "phan_hang", "diem_so", "phan_khuc",
        "ten_khach", "sdt", "nhu_cau_mo_ta", "ly_do_chi_tiet", "tu_khoa_nhan_dien",
        "ghi_chu_sales", "sla_phut", "id"
    ]

    edited_df = st.data_editor(
        filtered_df[display_cols],
        column_config=column_config,
        use_container_width=True,
        num_rows="fixed",
        height=480,
        key="leads_editor_premium"
    )

    # Đồng bộ thay đổi
    if not edited_df.equals(filtered_df[display_cols]):
        for idx, row in edited_df.iterrows():
            lead_id = row["id"]
            mask = st.session_state.df_leads["id"] == lead_id
            st.session_state.df_leads.loc[mask, "trang_thai_duyet"] = row["trang_thai_duyet"]
            st.session_state.df_leads.loc[mask, "sales_phu_trach"] = row["sales_phu_trach"]
            st.session_state.df_leads.loc[mask, "phan_hang"] = row["phan_hang"]
            st.session_state.df_leads.loc[mask, "ghi_chu_sales"] = row["ghi_chu_sales"]


# -------------------------------------------------------------
# TAB 3: SALES HANDOFF & TALK-TRACK (ZALO 1-TAP)
# -------------------------------------------------------------
with tab_handoff:
    st.markdown('<div class="section-header">📲 Thẻ Bàn Giao Tác Chiến & Kịch Bản Mở Lời (Ice-Breaker)</div>', unsafe_allow_html=True)
    st.caption("👉 Giúp Sales nắm trọn bối cảnh, từ khóa đắt giá và câu mở lời chuẩn xác ngay trước khi bấm gọi khách.")

    hcol1, hcol2 = st.columns([1, 1.8])

    with hcol1:
        lead_options = [
            f"#{r['id']} - {r['ten_khach']} ({r['phan_hang']} - {r['diem_so']}đ - {r['phan_khuc']})"
            for _, r in filtered_df.iterrows()
        ]
        if lead_options:
            selected_option = st.selectbox("Chọn khách hàng để xuất kịch bản:", lead_options, key="select_handoff_lead")
            selected_id = int(selected_option.split(" - ")[0].replace("#", ""))
            s_lead = st.session_state.df_leads[st.session_state.df_leads["id"] == selected_id].iloc[0]

            st.markdown(f"""
            <div style="background:rgba(15, 23, 42, 0.8);border:1px solid rgba(212, 175, 55, 0.3);border-radius:12px;padding:20px;margin-top:15px;">
                <h4 style="color:#FDE68A;margin:0 0 10px 0;">👤 Chân Dung Khách Hàng</h4>
                <p style="font-size:14px;color:#f1f5f9;margin:4px 0;"><b>Họ Tên:</b> {s_lead['ten_khach']}</p>
                <p style="font-size:14px;color:#f1f5f9;margin:4px 0;"><b>Điện Thoại:</b> <a href="tel:0{s_lead['sdt']}" style="color:#60a5fa;text-decoration:none;">0{s_lead['sdt']} 📞</a></p>
                <p style="font-size:14px;color:#f1f5f9;margin:4px 0;"><b>Phân Khúc:</b> <span style="color:#FDE68A;">{s_lead['phan_khuc']}</span></p>
                <p style="font-size:14px;color:#f1f5f9;margin:4px 0;"><b>Điểm Số:</b> <b style="color:#ef4444;">{s_lead['diem_so']}/100</b> [{s_lead['phan_hang']}]</p>
                <p style="font-size:14px;color:#f1f5f9;margin:4px 0;"><b>Trạng Thái Duyệt:</b> {s_lead['trang_thai_duyet']}</p>
                <p style="font-size:14px;color:#f1f5f9;margin:4px 0;"><b>Hạn Xử Lý (SLA):</b> <b>{s_lead['sla_phut']} phút</b></p>
                <hr style="border-color:rgba(255,255,255,0.1);margin:12px 0;">
                <p style="font-size:12px;color:#94a3b8;margin:0;"><b>Đề Xuất Hành Động:</b><br>{s_lead['hanh_dong_sales']}</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.info("Không có dữ liệu phù hợp với bộ lọc hiện tại.")
            s_lead = None

    with hcol2:
        if s_lead is not None:
            st.markdown("##### 💬 Nội Dung Thẻ Zalo 1-Chạm (Bấm Sao Chép & Gửi Nhóm Tác Chiến)")
            zalo_text = generate_zalo_card(s_lead)
            st.code(zalo_text, language="text")
            st.caption("💡 Đoạn tin nhắn trên đã kèm theo Ice-breaker Hook độc quyền được cá nhân hóa cho khách hàng này.")


# -------------------------------------------------------------
# TAB 4: AI MATRIX & AUDIT LOG
# -------------------------------------------------------------
with tab_matrix:
    st.markdown('<div class="section-header">🧠 Ma Trận Chấm Điểm 5 Tiêu Chí BANT-E & Rào Chắn Rủi Ro</div>', unsafe_allow_html=True)

    mcol1, mcol2 = st.columns(2)

    with mcol1:
        st.markdown("""
        <div style="background:rgba(239, 68, 68, 0.05);border:1px solid rgba(239, 68, 68, 0.2);padding:20px;border-radius:12px;">
            <h4 style="color:#f87171;margin-top:0;">💎 TIÊU CHÍ CỘNG 50 ĐIỂM (VIP SIÊU TIỀM NĂNG)</h4>
            <ul style="font-size:13px;color:#e2e8f0;line-height:1.7;">
                <li><b>Ngân sách lớn:</b> Từ 20-30 tỷ trở lên, "tài chính mạnh", "thanh toán thẳng", "không thành vấn đề".</li>
                <li><b>Loại hình cao cấp:</b> Penthouse hồ bơi riêng, Biệt thự đơn lập, Shophouse khối đế lớn, Đất CN/Sàn VP ≥ 2000m2.</li>
                <li><b>Vị trí đắc địa:</b> Ven sông, Vinhomes Ocean Park, Phú Mỹ Hưng, Khu Đông.</li>
                <li><b>Chân dung VIP:</b> Chủ doanh nghiệp lớn, Nhà đầu tư chuyên nghiệp gom sỉ 5-10 căn.</li>
                <li><b>Pháp lý & Cấp thiết:</b> Pháp lý chuẩn 100%, Sổ hồng riêng, muốn gặp trực tiếp CĐT/Giám đốc dự án.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    with mcol2:
        st.markdown("""
        <div style="background:rgba(100, 116, 139, 0.05);border:1px solid rgba(100, 116, 139, 0.2);padding:20px;border-radius:12px;">
            <h4 style="color:#94a3b8;margin-top:0;">🚫 TIÊU CHÍ TRỪ 50 ĐIỂM (RÁC / LOẠI TRỪ)</h4>
            <ul style="font-size:13px;color:#e2e8f0;line-height:1.7;">
                <li><b>Yêu cầu phi thực tế:</b> Mua nhà Q1 giá 1 tỷ, thuê trung tâm 2 triệu, nhà sân vườn hồ bơi vài trăm triệu.</li>
                <li><b>Không có nhu cầu:</b> Nhầm số, dữ liệu cũ ngành khác trộn vào.</li>
                <li><b>Khách không thiện chí:</b> "Hỏi giá cho vui", chưa có ý định mua, thái độ bất hợp tác.</li>
                <li><b>Spam / Quảng cáo:</b> Mời chào bảo hiểm, vay vốn tín dụng.</li>
                <li><b>Lỗi liên lạc:</b> Thuê bao, gọi nhiều lần không bắt máy, không phản hồi Zalo.</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("""
    <div style="background:rgba(15, 23, 42, 0.6);border:1px solid rgba(255,255,255,0.08);padding:18px;border-radius:12px;font-size:13px;color:#94a3b8;line-height:1.6;">
        🛡️ <b>Cơ Chế Chống Ảo Giác (Anti-Hallucination):</b> Hệ thống áp dụng nguyên tắc <i>Evidence-Based Scoring</i> — mọi điểm thưởng hoặc phạt đều bắt buộc trích xuất trực tiếp cụm từ nguyên văn trong lời mô tả của khách hàng làm bằng chứng kiểm toán.
    </div>
    """, unsafe_allow_html=True)


# ==========================================
# FOOTER BẢN QUYỀN
# ==========================================
st.markdown("<br><hr style='border-color:rgba(255,255,255,0.06);'>", unsafe_allow_html=True)
st.markdown("""
<div style="display:flex;justify-content:space-between;align-items:center;color:#64748b;font-size:12px;padding:10px 0;">
    <div>AURUM REAL ESTATE INTELLIGENCE SUITE • AI4A AGENTIC ECOSYSTEM</div>
    <div>Đóng gói theo chuẩn Kỹ năng <code>lead_scoring</code> • Mentor: <b>MT Đức Thuận</b></div>
</div>
""", unsafe_allow_html=True)
