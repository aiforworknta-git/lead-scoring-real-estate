#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
AI4A REAL ESTATE LEAD SCORING & HUMAN-IN-THE-LOOP APPROVAL HUB
Được xây dựng dựa trên Kỹ năng lead_scoring và tieu_chi_cham_diem.txt
Chuẩn nghiệp vụ AI4A - Agentic AI with Google Antigravity
=============================================================================
"""

import os
import sys
import pandas as pd
import streamlit as st

# ==========================================
# CẤU HÌNH TRANG STREAMLIT & GIAO DIỆN
# ==========================================
st.set_page_config(
    page_title="AI4A - Real Estate Lead Scoring Hub",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS cho phong cách hiện đại, thanh lịch, chuẩn Bất Động Sản cao cấp
st.markdown("""
<style>
    /* Metric Cards */
    [data-testid="stMetricValue"] {
        font-size: 26px;
        font-weight: 700;
    }
    .metric-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    /* Badges */
    .badge-hot {
        background-color: #ef4444;
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 13px;
    }
    .badge-warm {
        background-color: #f59e0b;
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 13px;
    }
    .badge-cold {
        background-color: #64748b;
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 13px;
    }
    .zalo-card {
        background: #0f172a;
        border-left: 5px solid #0088ff;
        border-radius: 8px;
        padding: 18px;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
        color: #e2e8f0;
        white-space: pre-wrap;
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

def run_ai_scoring_engine(lead_desc: str) -> dict:
    """
    Agentic AI Scoring Engine: Tự động phân tích văn bản mô tả nhu cầu,
    đối chiếu ma trận BANT-E, nhận diện bằng chứng và chấm điểm 0-100.
    """
    if not isinstance(lead_desc, str) or not lead_desc.strip():
        return {
            "score": 0,
            "tier": "COLD",
            "reason": "Thiếu thông tin mô tả nhu cầu",
            "keywords": "",
            "action": "Cần bổ sung thông tin khảo sát",
            "sla": 0
        }

    text_lower = lead_desc.lower()
    
    # 1. Quét tiêu chí trừ 50 điểm
    minus_triggers = []
    for rule in NEGATIVE_MINUS_50_RULES:
        for kw in rule["keywords"]:
            if kw in text_lower:
                minus_triggers.append((rule["category"], kw))
                break

    # 2. Quét tiêu chí cộng 50 điểm
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
        reason = f"Dính tiêu chí loại trừ: {', '.join(categories)}"
        action = "Đưa vào danh sách hủy / Blacklist CRM / Chặn số"
        sla = 0
    elif plus_triggers:
        score = min(100, base_score + 50)
        tier = "HOT"
        categories = [t[0] for t in plus_triggers]
        keywords = [t[1] for t in plus_triggers]
        reason = f"Đạt chuẩn VIP Siêu Tiềm Năng: {', '.join(categories)}"
        action = "Giao Giám đốc dự án / Top Senior Broker liên hệ trong 15-30 phút"
        sla = 15
    else:
        score = base_score
        reason_parts = []
        keywords = []
        for rule in MID_TIER_RULES:
            matched = [kw for kw in rule["keywords"] if kw in text_lower]
            if len(matched) >= 2:
                score += rule["bonus"]
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
        "reason": reason,
        "keywords": ", ".join(keywords),
        "action": action,
        "sla": sla
    }

def generate_zalo_card(row: pd.Series) -> str:
    """Tạo mẫu tin nhắn Zalo 1-chạm chuẩn Sales Handoff Protocol."""
    name = row.get("ten_khach", "Quý khách")
    phone = row.get("sdt", "")
    score = row.get("diem_so", 0)
    tier = row.get("phan_hang", "WARM")
    desc = row.get("nhu_cau_mo_ta", "")
    keywords = row.get("tu_khoa_nhan_dien", "")
    sla = row.get("sla_phut", 24)

    tier_emoji = "🔥" if "HOT" in str(tier) else ("⚡" if "WARM" in str(tier) else "❄️")
    sla_text = "Trong vòng 15 PHÚT" if "HOT" in str(tier) else "Trong vòng 24 GIỜ"
    
    # Kịch bản mở lời gợi ý theo phân khúc
    if "penthouse" in desc.lower():
        hook = f"Em chào Anh/Chị {name}, em nhận được thông tin Anh/Chị đang quan tâm dòng Penthouse độc bản có hồ bơi và thang máy riêng. Em xin phép gửi clip 3D và layout chi tiết qua Zalo nhé!"
    elif "biệt thự" in desc.lower():
        hook = f"Em chào Anh/Chị {name}, em phụ trách quỹ biệt thự đơn lập ven sông phân khu cao cấp. Em xin gửi thông tin mặt bằng phong thủy hướng Đông Nam qua Zalo để Anh/Chị xem trước ạ!"
    elif "shophouse" in desc.lower():
        hook = f"Em chào Anh {name}, về gói gom sỉ shophouse mặt đường lớn cam kết thuê lại, Giám đốc dự án bên em mong muốn hẹn một cuộc gọi ngắn 5 phút trực tiếp với Anh để chốt mức chiết khấu ạ!"
    elif "căn hộ" in desc.lower() or "2pn" in desc.lower():
        hook = f"Em chào Chị {name}, em thấy Chị quan tâm căn hộ 2PN Quận 7 và muốn ghé xem nhà mẫu cuối tuần này. Em gửi Chị thư mời và quà tặng chiết khấu riêng khi đi xem nhé!"
    elif "spa" in desc.lower() or "mặt bằng" in desc.lower():
        hook = f"Em chào Anh/Chị {name}, em có 1 mặt bằng spa Quận 1 80-100m2 giá dưới 50tr đúng ngân sách và ký dài hạn. Chiều nay Anh/Chị tiện qua xem thực tế không ạ?"
    else:
        hook = f"Em chào Anh/Chị {name}, em nhận được yêu cầu tư vấn Bất Động Sản từ Anh/Chị và xin phép gửi thông tin chi tiết qua Zalo ạ!"

    card = f"""{tier_emoji} [BÀN GIAO LEAD {tier} - BẤT ĐỘNG SẢN] {tier_emoji}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Khách hàng: {name}
📱 Số điện thoại: 0{phone} (Bấm gọi ngay)
⭐ Điểm số AI: {score}/100 [HẠNG: {tier}]
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
# KHỞI TẠO STATE & NẠP DỮ LIỆU
# ==========================================

SAMPLE_DATA_PATH = "my-workspace/sample_leads_clean.csv"

def load_initial_data(filepath: str) -> pd.DataFrame:
    """Nạp file CSV và áp dụng AI Scoring khởi tạo nếu chưa có."""
    if os.path.exists(filepath):
        df = pd.read_csv(filepath, encoding="utf-8-sig")
    else:
        # Fallback dữ liệu mẫu tối thiểu nếu chưa có file
        df = pd.DataFrame([
            {"id": 1, "ten_khach": "Lê Anh Lan", "sdt": "964591036", "nhu_cau_mo_ta": "Tìm Penthouse hồ bơi riêng, ngân sách không thành vấn đề."},
            {"id": 2, "ten_khach": "Hồ Hồng Linh", "sdt": "848475144", "nhu_cau_mo_ta": "Khách hàng nhầm số, không có nhu cầu BĐS."},
            {"id": 3, "ten_khach": "Lý Đức Cường", "sdt": "953430096", "nhu_cau_mo_ta": "Căn hộ 2PN Quận 7, tài chính 4-5 tỷ, vay ngân hàng 70%."}
        ])

    # Thực hiện AI Scoring cho từng dòng
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
            "ly_do_chi_tiet": ai_res["reason"],
            "tu_khoa_nhan_dien": ai_res["keywords"],
            "hanh_dong_sales": ai_res["action"],
            "sla_phut": ai_res["sla"],
            "trang_thai_duyet": "⏳ Chờ duyệt",
            "sales_phu_trach": "Chưa phân bổ",
            "ghi_chu_sales": ""
        })

    return pd.DataFrame(scored_rows)

if "df_leads" not in st.session_state:
    st.session_state.df_leads = load_initial_data(SAMPLE_DATA_PATH)


# ==========================================
# GIAO DIỆN THANH BÊN (SIDEBAR)
# ==========================================

with st.sidebar:
    st.image("https://img.icons8.com/isometric/100/apartment.png", width=70)
    st.title("AI4A Lead Hub")
    st.caption("🏢 Chấm điểm & Phê duyệt Lead Bất Động Sản")
    st.markdown("---")

    st.subheader("📂 Nguồn Dữ Liệu")
    data_source = st.radio(
        "Chọn nguồn nạp:",
        ["Dữ liệu 500 Leads chuẩn", "Tải lên tệp CSV mới", "Thêm 1 lead nhanh"],
        index=0
    )

    if data_source == "Tải lên tệp CSV mới":
        uploaded_file = st.file_uploader("Chọn file CSV (cột id, ten_khach, sdt, nhu_cau_mo_ta):", type=["csv"])
        if uploaded_file is not None:
            if st.button("🔄 Nạp & Chấm Điểm File Này"):
                raw_df = pd.read_csv(uploaded_file, encoding="utf-8-sig")
                scored_rows = []
                for idx, row in raw_df.iterrows():
                    desc = str(row.get("nhu_cau_mo_ta", ""))
                    ai_res = run_ai_scoring_engine(desc)
                    scored_rows.append({
                        "id": row.get("id", idx + 1),
                        "ten_khach": row.get("ten_khach", f"Khách hàng #{idx+1}"),
                        "sdt": str(row.get("sdt", "")),
                        "nhu_cau_mo_ta": desc,
                        "diem_so": ai_res["score"],
                        "phan_hang": ai_res["tier"],
                        "ly_do_chi_tiet": ai_res["reason"],
                        "tu_khoa_nhan_dien": ai_res["keywords"],
                        "hanh_dong_sales": ai_res["action"],
                        "sla_phut": ai_res["sla"],
                        "trang_thai_duyet": "⏳ Chờ duyệt",
                        "sales_phu_trach": "Chưa phân bổ",
                        "ghi_chu_sales": ""
                    })
                st.session_state.df_leads = pd.DataFrame(scored_rows)
                st.success(f"Đã nạp và chấm điểm {len(scored_rows)} khách hàng!")
                st.rerun()

    elif data_source == "Thêm 1 lead nhanh":
        with st.expander("➕ Nhập thông tin khách hàng mới", expanded=True):
            with st.form("new_lead_form"):
                new_name = st.text_input("Họ tên khách:")
                new_phone = st.text_input("Số điện thoại:")
                new_desc = st.text_area("Mô tả nhu cầu:")
                submitted = st.form_submit_button("🚀 AI Chấm Điểm & Thêm")
                if submitted and new_name and new_desc:
                    ai_res = run_ai_scoring_engine(new_desc)
                    new_id = int(st.session_state.df_leads["id"].max()) + 1 if not st.session_state.df_leads.empty else 1
                    new_row = {
                        "id": new_id,
                        "ten_khach": new_name,
                        "sdt": new_phone,
                        "nhu_cau_mo_ta": new_desc,
                        "diem_so": ai_res["score"],
                        "phan_hang": ai_res["tier"],
                        "ly_do_chi_tiet": ai_res["reason"],
                        "tu_khoa_nhan_dien": ai_res["keywords"],
                        "hanh_dong_sales": ai_res["action"],
                        "sla_phut": ai_res["sla"],
                        "trang_thai_duyet": "⏳ Chờ duyệt",
                        "sales_phu_trach": "Chưa phân bổ",
                        "ghi_chu_sales": ""
                    }
                    st.session_state.df_leads = pd.concat([pd.DataFrame([new_row]), st.session_state.df_leads], ignore_index=True)
                    st.success(f"Đã thêm lead #{new_id}: {ai_res['tier']} ({ai_res['score']} điểm)!")
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
    search_keyword = st.text_input("Tìm kiếm theo tên/SĐT/từ khóa:", placeholder="Nhập để lọc...")

    st.markdown("---")
    if st.button("🔄 Đặt Lại Dữ Liệu Ban Đầu"):
        st.session_state.df_leads = load_initial_data(SAMPLE_DATA_PATH)
        st.success("Đã hoàn tác dữ liệu về trạng thái ban đầu!")
        st.rerun()


# ==========================================
# KHU VỰC CHÍNH (MAIN DASHBOARD)
# ==========================================

# 1. Header
st.title("🏢 AI4A Real Estate Lead Scoring Hub")
st.markdown("""
**Hệ thống Chấm Điểm & Phê Duyệt Khách Hàng Tiềm Năng (Human-in-the-Loop)**  
*Tích hợp AI Agent quét tự động 5 tiêu chí BANT-E và cơ chế Cộng/Trừ 50 điểm thực chiến.*
""")

# 2. Thống kê KPI tóm tắt
df = st.session_state.df_leads.copy()
total_leads = len(df)
hot_count = len(df[df["phan_hang"] == "HOT"])
warm_count = len(df[df["phan_hang"] == "WARM"])
cold_count = len(df[df["phan_hang"] == "COLD"])
approved_count = len(df[df["trang_thai_duyet"] == "✅ Duyệt bàn giao"])

col1, col2, col3, col4, col5 = st.columns(5)
with col1:
    st.metric("Tổng Leads", f"{total_leads:,}")
with col2:
    st.metric("🔥 HOT (VIP)", f"{hot_count} ({hot_count/total_leads*100:.1f}%)" if total_leads else "0")
with col3:
    st.metric("⚡ WARM (Tiềm năng)", f"{warm_count} ({warm_count/total_leads*100:.1f}%)" if total_leads else "0")
with col4:
    st.metric("❄️ COLD (Rác/Hủy)", f"{cold_count} ({cold_count/total_leads*100:.1f}%)" if total_leads else "0")
with col5:
    st.metric("✅ Đã Duyệt", f"{approved_count}/{total_leads}")

st.markdown("---")

# 3. Thao tác phê duyệt nhanh hàng loạt
st.subheader("⚡ Thao Tác Phê Duyệt Nhanh (Batch Actions)")
bcol1, bcol2, bcol3, bcol4 = st.columns([1.2, 1.2, 1.2, 2])

with bcol1:
    if st.button("🔥 Duyệt Nhanh Tất Cả HOT", use_container_width=True):
        st.session_state.df_leads.loc[
            st.session_state.df_leads["phan_hang"] == "HOT", "trang_thai_duyet"
        ] = "✅ Duyệt bàn giao"
        st.session_state.df_leads.loc[
            st.session_state.df_leads["phan_hang"] == "HOT", "sales_phu_trach"
        ] = "Top Senior Broker / GĐKD"
        st.toast("Đã tự động phê duyệt tất cả Lead HOT cho Giám đốc kinh doanh!", icon="🔥")
        st.rerun()

with bcol2:
    if st.button("❄️ Hủy Nhanh Tất Cả COLD", use_container_width=True):
        st.session_state.df_leads.loc[
            st.session_state.df_leads["phan_hang"] == "COLD", "trang_thai_duyet"
        ] = "❌ Hủy / Rác"
        st.toast("Đã đánh dấu hủy toàn bộ Lead COLD (Rác/Lỗi liên lạc)!", icon="❄️")
        st.rerun()

with bcol3:
    if st.button("🔄 Quét Lại Toàn Bộ AI", use_container_width=True):
        for idx, row in st.session_state.df_leads.iterrows():
            res = run_ai_scoring_engine(str(row["nhu_cau_mo_ta"]))
            st.session_state.df_leads.at[idx, "diem_so"] = res["score"]
            st.session_state.df_leads.at[idx, "phan_hang"] = res["tier"]
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

st.markdown("---")

# 4. Bảng duyệt tương tác st.data_editor (Human-in-the-Loop)
st.subheader("📋 Bảng Phê Duyệt & Phân Bổ Khách Hàng (st.data_editor)")
st.caption("💡 *Bạn có thể bấm trực tiếp vào cột 'Trạng thái duyệt', 'Sales phụ trách' hoặc 'Phân hạng' để chỉnh sửa ngay lập tức.*")

# Áp dụng bộ lọc
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
        filtered_df["tu_khoa_nhan_dien"].str.lower().str.contains(kw, na=False)
    ]

# Cấu hình hiển thị cột cho st.data_editor
column_config = {
    "trang_thai_duyet": st.column_config.SelectboxColumn(
        "Trạng Thái Duyệt",
        help="Phê duyệt trạng thái bàn giao của Lead",
        options=["⏳ Chờ duyệt", "✅ Duyệt bàn giao", "🔍 Cần xác minh", "❌ Hủy / Rác"],
        required=True
    ),
    "phan_hang": st.column_config.SelectboxColumn(
        "Hạng AI",
        help="Phân hạng của Lead",
        options=["HOT", "WARM", "COLD"],
        required=True
    ),
    "diem_so": st.column_config.ProgressColumn(
        "Điểm AI",
        help="Thang điểm 0 - 100",
        format="%d",
        min_value=0,
        max_value=100
    ),
    "sales_phu_trach": st.column_config.TextColumn(
        "Sales Phụ Trách",
        help="Nhập tên nhân sự phụ trách tiếp nhận"
    ),
    "ghi_chu_sales": st.column_config.TextColumn(
        "Ghi Chú Duyệt",
        help="Nhập ghi chú phản hồi hoặc dặn dò Sales"
    ),
    "id": st.column_config.NumberColumn("ID", width="small", disabled=True),
    "ten_khach": st.column_config.TextColumn("Tên Khách Hàng", disabled=True),
    "sdt": st.column_config.TextColumn("SĐT", disabled=True),
    "nhu_cau_mo_ta": st.column_config.TextColumn("Nhu Cầu Mô Tả", width="large", disabled=True),
    "ly_do_chi_tiet": st.column_config.TextColumn("Bằng Chứng AI", width="medium", disabled=True),
    "tu_khoa_nhan_dien": st.column_config.TextColumn("Từ Khóa Vàng", disabled=True),
    "hanh_dong_sales": st.column_config.TextColumn("Đề Xuất Hành Động", disabled=True),
    "sla_phut": st.column_config.NumberColumn("SLA (Phút)", disabled=True)
}

# Cột hiển thị theo thứ tự ưu tiên
display_columns = [
    "trang_thai_duyet", "sales_phu_trach", "phan_hang", "diem_so",
    "ten_khach", "sdt", "nhu_cau_mo_ta", "ly_do_chi_tiet",
    "tu_khoa_nhan_dien", "ghi_chu_sales", "sla_phut", "id"
]

# Hiển thị data editor
edited_df = st.data_editor(
    filtered_df[display_columns],
    column_config=column_config,
    use_container_width=True,
    num_rows="fixed",
    height=450,
    key="leads_editor"
)

# Cập nhật thay đổi ngược lại session_state nếu có chỉnh sửa
if not edited_df.equals(filtered_df[display_columns]):
    for idx, row in edited_df.iterrows():
        lead_id = row["id"]
        mask = st.session_state.df_leads["id"] == lead_id
        st.session_state.df_leads.loc[mask, "trang_thai_duyet"] = row["trang_thai_duyet"]
        st.session_state.df_leads.loc[mask, "sales_phu_trach"] = row["sales_phu_trach"]
        st.session_state.df_leads.loc[mask, "phan_hang"] = row["phan_hang"]
        st.session_state.df_leads.loc[mask, "ghi_chu_sales"] = row["ghi_chu_sales"]

st.markdown("---")

# 5. Chi tiết từng khách hàng & Máy phát sinh Thẻ Zalo 1-Chạm
st.subheader("📲 Chi Tiết Khách Hàng & Thẻ Bàn Giao Zalo 1-Chạm")

col_lead_select, col_preview = st.columns([1, 1.8])

with col_lead_select:
    lead_options = [
        f"#{r['id']} - {r['ten_khach']} ({r['phan_hang']} - {r['diem_so']}đ)"
        for _, r in filtered_df.iterrows()
    ]
    if lead_options:
        selected_option = st.selectbox("Chọn khách hàng để xem & xuất thẻ bàn giao:", lead_options)
        selected_id = int(selected_option.split(" - ")[0].replace("#", ""))
        selected_lead = st.session_state.df_leads[st.session_state.df_leads["id"] == selected_id].iloc[0]

        # Hiển thị thẻ tóm tắt
        st.markdown(f"""
        ### 👤 Chân Dung Khách Hàng: **{selected_lead['ten_khach']}**
        - **Mã số ID:** `#{selected_lead['id']}`
        - **Điện thoại:** `0{selected_lead['sdt']}`
        - **Phân hạng:** **{selected_lead['phan_hang']}** ({selected_lead['diem_so']}/100 điểm)
        - **Trạng thái duyệt:** **{selected_lead['trang_thai_duyet']}**
        - **Thời hạn xử lý (SLA):** **{selected_lead['sla_phut']} phút**
        - **Đề xuất hành động:** {selected_lead['hanh_dong_sales']}
        - **Bằng chứng điểm số:** *{selected_lead['ly_do_chi_tiet']}*
        """)
    else:
        st.info("Không có khách hàng nào phù hợp với bộ lọc hiện tại.")
        selected_lead = None

with col_preview:
    if selected_lead is not None:
        st.markdown("#### 💬 Mẫu Tin Nhắn Bàn Giao Zalo / Telegram Tác Chiến")
        zalo_text = generate_zalo_card(selected_lead)
        st.code(zalo_text, language="text")
        st.caption("👉 Sao chép đoạn tin nhắn trên để gửi trực tiếp vào nhóm Zalo kinh doanh hoặc phân bổ cho Sales.")

st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #64748b; font-size: 13px; padding: 10px;">
    AI4A Real Estate Lead Scoring Hub • Đóng gói theo chuẩn Kỹ năng <code>lead_scoring</code> • Mentor MT Đức Thuận
</div>
""", unsafe_allow_html=True)
