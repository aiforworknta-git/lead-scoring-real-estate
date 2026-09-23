# Script sinh file PowerPoint 16:9 chuẩn Executive McKinsey/BCG cho AI4A PPT Architect
$ErrorActionPreference = "Stop"

function To-Rgb([int]$r, [int]$g, [int]$b) {
    return [int]($r + ($g * 256) + ($b * 65536))
}

$cDarkBg     = To-Rgb 15 23 42       # #0F172A
$cLightBg    = To-Rgb 248 250 252    # #F8FAFC
$cWhite      = To-Rgb 255 255 255    # #FFFFFF
$cTextDark   = To-Rgb 15 23 42       # #0F172A
$cTextMuted  = To-Rgb 100 116 139    # #64748B
$cBorder     = To-Rgb 226 232 240    # #E2E8F0
$cGreen      = To-Rgb 5 150 105      # #059669
$cDarkGreen  = To-Rgb 0 130 0        # #008200
$cBlue       = To-Rgb 2 132 199      # #0284C7
$cRed        = To-Rgb 220 38 38      # #DC2626
$cAmber      = To-Rgb 217 119 6      # #D97706
$cCardBg     = To-Rgb 255 255 255    # #FFFFFF
$cCardDark   = To-Rgb 30 41 59       # #1E293B

Write-Host "Khoi tao PowerPoint Application COM..."
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue

$pres = $ppt.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoTrue)
$pres.PageSetup.SlideWidth = 960
$pres.PageSetup.SlideHeight = 540

# Helper: Tao slide co background mau
function New-CustomSlide($layoutColor) {
    $slide = $pres.Slides.Add($pres.Slides.Count + 1, 12) # 12 = ppLayoutBlank
    $bg = $slide.Shapes.AddShape(1, 0, 0, 960, 540) # 1 = msoShapeRectangle
    $bg.Fill.Solid()
    $bg.Fill.ForeColor.RGB = $layoutColor
    $bg.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
    return $slide
}

# Helper: Tao header chuan Action Title
function Add-SlideHeader($slide, $category, $actionTitle, $isDark=$false) {
    # Category tag
    $catBox = $slide.Shapes.AddTextbox(1, 45, 25, 870, 20)
    $catBox.TextFrame.MarginLeft = 0; $catBox.TextFrame.MarginTop = 0
    $catBox.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $catRange = $catBox.TextFrame.TextRange
    $catRange.Text = $category.ToUpper()
    $catRange.Font.Name = "Segoe UI"
    $catRange.Font.Size = 10
    $catRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $catRange.Font.Color.RGB = if ($isDark) { $cGreen } else { $cBlue }

    # Action Title
    $titleBox = $slide.Shapes.AddTextbox(1, 45, 46, 870, 52)
    $titleBox.TextFrame.MarginLeft = 0; $titleBox.TextFrame.MarginTop = 0
    $titleBox.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $titleRange = $titleBox.TextFrame.TextRange
    $titleRange.Text = $actionTitle
    $titleRange.Font.Name = "Segoe UI"
    $titleRange.Font.Size = 17
    $titleRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $titleRange.Font.Color.RGB = if ($isDark) { $cWhite } else { $cTextDark }

    # Divider bar
    $bar = $slide.Shapes.AddShape(1, 45, 102, 870, 2)
    $bar.Fill.Solid()
    $bar.Fill.ForeColor.RGB = if ($isDark) { $cCardDark } else { $cBorder }
    $bar.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
}

# ==========================================
# SLIDE 1: BIA DIEU HANH (Dark Executive)
# ==========================================
Write-Host "Dang tao Slide 1: Bia Trinh Chieu..."
$s1 = New-CustomSlide $cDarkBg

# Badge Tren
$b1 = $s1.Shapes.AddShape(5, 45, 55, 360, 28) # 5 = msoShapeRoundedRectangle
$b1.Fill.Solid()
$b1.Fill.ForeColor.RGB = (To-Rgb 30 41 59)
$b1.Line.ForeColor.RGB = $cGreen
$b1.Line.Weight = 1.2
$b1.TextFrame.TextRange.Text = "AI4A EXECUTIVE FRAMEWORK | MCKINSEY STANDARD"
$b1.TextFrame.TextRange.Font.Name = "Segoe UI"
$b1.TextFrame.TextRange.Font.Size = 9
$b1.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
$b1.TextFrame.TextRange.Font.Color.RGB = $cGreen

# Title Chinh
$t1 = $s1.Shapes.AddTextbox(1, 45, 105, 870, 150)
$t1.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
$tr1 = $t1.TextFrame.TextRange
$tr1.Text = "KIẾN TRÚC DASHBOARD DOANH NGHIỆP LỚN`nVÀ ĐIỀU PHỐI MULTI-AGENT TRÊN GOOGLE DRIVE"
$tr1.Font.Name = "Segoe UI"
$tr1.Font.Size = 28
$tr1.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
$tr1.Font.Color.RGB = $cWhite

# Subtitle
$sub1 = $s1.Shapes.AddTextbox(1, 45, 230, 870, 60)
$sub1.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
$subRange = $sub1.TextFrame.TextRange
$subRange.Text = "Cẩm nang quy chuẩn phân quyền 5 tầng thư mục, cơ chế khóa tệp trạng thái (State-Lock)`nvà kỹ thuật tiền tổng hợp (Pre-aggregation) chống xung đột cho đội ngũ Agentic AI"
$subRange.Font.Name = "Segoe UI"
$subRange.Font.Size = 14
$subRange.Font.Color.RGB = (To-Rgb 148 163 184)

# 3 Feature Pills
$pills = @(
    @{ Title = "5 TẦNG THƯ MỤC DRIVE"; Sub = "Phân vùng Read/Write bất biến" },
    @{ Title = "GIAO THỨC STATE-LOCK"; Sub = "Khóa file & Manifest chống race condition" },
    @{ Title = "PRE-AGGREGATION < 1.5MB"; Sub = "Nén 97% dữ liệu, mở tức thì trên Mobile" }
)
for ($i=0; $i -lt 3; $i++) {
    $px = 45 + ($i * 295)
    $pillBox = $s1.Shapes.AddShape(5, $px, 320, 280, 85)
    $pillBox.Fill.Solid()
    $pillBox.Fill.ForeColor.RGB = (To-Rgb 30 41 59)
    $pillBox.Line.ForeColor.RGB = (To-Rgb 51 65 85)
    $pillBox.Line.Weight = 1
    
    $pTxt = $pillBox.TextFrame.TextRange
    $pTxt.Text = "$($pills[$i].Title)`n$($pills[$i].Sub)"
    $pTxt.Font.Name = "Segoe UI"
    $pTxt.Font.Size = 11
    $pTxt.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $pTxt.Font.Color.RGB = $cWhite
    $pTxt.Paragraphs(2).Font.Size = 10
    $pTxt.Paragraphs(2).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $pTxt.Paragraphs(2).Font.Color.RGB = (To-Rgb 148 163 184)
}

# Footer meta
$ft1 = $s1.Shapes.AddTextbox(1, 45, 475, 870, 30)
$ftRange = $ft1.TextFrame.TextRange
$ftRange.Text = "Hệ thống: AI4A Student Workspace | Ban Kiến Trúc Agentic AI | Định dạng 16:9 Widescreen"
$ftRange.Font.Name = "Segoe UI"
$ftRange.Font.Size = 10
$ftRange.Font.Color.RGB = (To-Rgb 100 116 139)

# ==========================================
# SLIDE 2: EXECUTIVE SUMMARY (3 Value Pillars)
# ==========================================
Write-Host "Dang tao Slide 2: Executive Summary..."
$s2 = New-CustomSlide $cLightBg
Add-SlideHeader $s2 "TÓM TẮT ĐIỀU HÀNH 60 GIÂY" "Chìa Khóa Làm Dashboard Lớn Nằm Ở Phân Tầng Thư Mục Bất Biến Và Bàn Giao Kèm Khóa Trạng Thái Giữa Các Agent"

$pillars = @(
    @{
        Num = "TRỤ CỘT 1";
        Head = "Kiến Trúc Drive 5 Tầng Phân Lập";
        Color = $cBlue;
        Points = @(
            "Tách bạch 5 vùng thư mục độc lập",
            "Mỗi Agent chỉ có quyền ghi trên 1 folder",
            "Đầu ra Agent trước là đầu vào Agent sau",
            "Triệt tiêu 100% rủi ro ghi đè file chéo"
        )
    },
    @{
        Num = "TRỤ CỘT 2";
        Head = "Giao Thức State-Lock & Hand-off";
        Color = $cGreen;
        Points = @(
            "Giao tiếp qua file manifest.json & lock",
            "Agent sau chỉ kích hoạt khi có chữ ký PASSED",
            "QA Auditor đóng vai trò chốt chặn độc lập",
            "Dừng ngay lập tức nếu sai số đối soát > 0"
        )
    },
    @{
        Num = "TRỤ CỘT 3";
        Head = "Pre-aggregation Nén Dữ Liệu 97%";
        Color = $cAmber;
        Points = @(
            "Không bao giờ kéo 50MB file thô lên UI",
            "Tiền tổng hợp thành các cube nhỏ < 1.5MB",
            "Thời gian render trang < 0.5s trên Mobile",
            "Tích hợp xuất thẻ ảnh Zalo 30s & chốt số"
        )
    }
)

for ($i=0; $i -lt 3; $i++) {
    $cx = 45 + ($i * 295)
    $card = $s2.Shapes.AddShape(5, $cx, 125, 280, 365)
    $card.Fill.Solid()
    $card.Fill.ForeColor.RGB = $cWhite
    $card.Line.ForeColor.RGB = $cBorder
    $card.Line.Weight = 1.2
    
    # Top accent bar on card
    $barTop = $s2.Shapes.AddShape(1, $cx, 125, 280, 6)
    $barTop.Fill.Solid()
    $barTop.Fill.ForeColor.RGB = $pillars[$i].Color
    $barTop.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
    
    # Tag
    $tag = $s2.Shapes.AddTextbox(1, $cx + 15, 145, 250, 22)
    $tag.TextFrame.MarginLeft = 0; $tag.TextFrame.MarginTop = 0
    $tr = $tag.TextFrame.TextRange
    $tr.Text = $pillars[$i].Num
    $tr.Font.Name = "Segoe UI"
    $tr.Font.Size = 10
    $tr.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $tr.Font.Color.RGB = $pillars[$i].Color
    
    # Card Header
    $hBox = $s2.Shapes.AddTextbox(1, $cx + 15, 172, 250, 48)
    $hBox.TextFrame.MarginLeft = 0; $hBox.TextFrame.MarginTop = 0
    $hBox.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $hr = $hBox.TextFrame.TextRange
    $hr.Text = $pillars[$i].Head
    $hr.Font.Name = "Segoe UI"
    $hr.Font.Size = 14
    $hr.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $hr.Font.Color.RGB = $cTextDark
    
    # Bullet points
    $bList = $s2.Shapes.AddTextbox(1, $cx + 15, 230, 250, 230)
    $bList.TextFrame.MarginLeft = 0; $bList.TextFrame.MarginTop = 0
    $bList.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $bRange = $bList.TextFrame.TextRange
    $bulletText = ($pillars[$i].Points | ForEach-Object { "•  $_" }) -join "`n`n"
    $bRange.Text = $bulletText
    $bRange.Font.Name = "Segoe UI"
    $bRange.Font.Size = 11
    $bRange.Font.Color.RGB = (To-Rgb 51 65 85)
}

# ==========================================
# SLIDE 3: THACH THUC (3 Warning Traps)
# ==========================================
Write-Host "Dang tao Slide 3: 3 Cam Bay Tu Than..."
$s3 = New-CustomSlide $cLightBg
Add-SlideHeader $s3 "THÁCH THỨC & CẢNH BÁO NGUY CƠ" "Môi Trường Drive Dùng Chung Dễ Gây Đổ Vỡ Hệ Thống Do Xung Đột Sync, Dữ Liệu Nặng Và Sai Số Không Kiểm Soát"

$traps = @(
    @{
        Title = "CẠM BẪY 1: XUNG ĐỘT GHI ĐÈ FILE";
        Sub = "Race Condition & Sync Latency";
        Icon = "[!]";
        Color = $cRed;
        Body = "Khi 2 agent cùng mở và cập nhật 1 file Excel/JSON, Google Drive tự động sinh file bản sao '(1)'.`n`nHậu quả: Gây đứt gãy luồng pipeline tự động, agent phía sau đọc dữ liệu cũ chưa cập nhật."
    },
    @{
        Title = "CẠM BẪY 2: DASHBOARD NẶNG TRÌNH DUYỆT";
        Sub = "Client Storage & Bandwidth Bloat";
        Icon = "[#]";
        Color = $cAmber;
        Body = "Nhúng thẳng file dữ liệu thô 50MB+ vào code HTML/JS dashboard khiến web mở mất 15-30 giây.`n`nHậu quả: Trình duyệt đơ lag, tốn RAM điện thoại và sập tab khi xem trên thiết bị di động."
    },
    @{
        Title = "CẠM BẪY 3: HIỆU ỨNG LAN TRUYỀN DỮ LIỆU BẨN";
        Sub = "Garbage In - Garbage Out Hazard";
        Icon = "[X]";
        Color = $cRed;
        Body = "Dashboard Architect lấy dữ liệu chưa qua Data Cleaner và QA Auditor để dựng biểu đồ.`n`nHậu quả: Sai lệch số liệu trước Ban Giám Đốc, chia cho 0, mất uy tín dữ liệu của phòng ban."
    }
)

for ($i=0; $i -lt 3; $i++) {
    $cx = 45 + ($i * 295)
    $card = $s3.Shapes.AddShape(5, $cx, 130, 280, 360)
    $card.Fill.Solid()
    $card.Fill.ForeColor.RGB = (To-Rgb 254 242 242)
    $card.Line.ForeColor.RGB = (To-Rgb 254 202 202)
    $card.Line.Weight = 1.2
    
    # Header box on warning card
    $wHead = $s3.Shapes.AddShape(1, $cx, 130, 280, 70)
    $wHead.Fill.Solid()
    $wHead.Fill.ForeColor.RGB = $traps[$i].Color
    $wHead.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
    
    $whRange = $wHead.TextFrame.TextRange
    $whRange.Text = "$($traps[$i].Title)`n$($traps[$i].Sub)"
    $whRange.Font.Name = "Segoe UI"
    $whRange.Font.Size = 11
    $whRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $whRange.Font.Color.RGB = $cWhite
    $whRange.Paragraphs(2).Font.Size = 9
    $whRange.Paragraphs(2).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $whRange.Paragraphs(2).Font.Color.RGB = (To-Rgb 254 226 226)
    
    # Body text
    $wBody = $s3.Shapes.AddTextbox(1, $cx + 15, 215, 250, 250)
    $wBody.TextFrame.MarginLeft = 0; $wBody.TextFrame.MarginTop = 0
    $wBody.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $wbRange = $wBody.TextFrame.TextRange
    $wbRange.Text = $traps[$i].Body
    $wbRange.Font.Name = "Segoe UI"
    $wbRange.Font.Size = 11
    $wbRange.Font.Color.RGB = (To-Rgb 69 10 10)
}

# ==========================================
# SLIDE 4: KIEN TRUC THU MUC GOOGLE DRIVE
# ==========================================
Write-Host "Dang tao Slide 4: Kien Truc Thu Muc..."
$s4 = New-CustomSlide $cLightBg
Add-SlideHeader $s4 "MÔ HÌNH HẠ TẦNG GOOGLE DRIVE" "Thiết Lập 5 Phân Vùng Chuyên Biệt Trên Drive Để Quy Định Rõ Ràng Ranh Giới Đọc - Ghi Cho Từng Agent"

$folders = @(
    @{ Folder = "00_RAW_INGESTION/"; Role = "Chỉ Đọc (Read-Only)"; Owner = "Data Ingest / ERP Sync"; Desc = "Lưu trữ dữ liệu thô trích xuất từ SAP, ERP, DMS. Không agent nào được sửa."; Color = $cBlue },
    @{ Folder = "01_CLEANSED_DATA/"; Role = "Độc Quyền Ghi (Write-Only)"; Owner = "ai4a-data-cleaner"; Desc = "Dữ liệu đã khử dòng rác, xử lý null, đồng bộ UTF-8 tiếng Việt, chống chia cho 0."; Color = $cGreen },
    @{ Folder = "02_PRE_AGGREGATED/"; Role = "Độc Quyền Ghi (Write-Only)"; Owner = "ai4a-dashboard-architect"; Desc = "Các khối Cube tổng hợp theo Chi nhánh / Quản lý / Tuần, nén kích thước < 1.5MB."; Color = $cAmber },
    @{ Folder = "03_DASHBOARD_CORE/"; Role = "Độc Quyền Ghi (Write-Only)"; Owner = "ai4a-dashboard-architect"; Desc = "Chứa mã nguồn Single-file HTML, style CSS và bộ công cụ chụp ảnh Zalo 30s."; Color = $cBlue },
    @{ Folder = "04_RELEASE_AUDIT/"; Role = "Chốt Chặn Kiểm Toán"; Owner = "ai4a-qa-auditor"; Desc = "Chứa báo cáo đối soát Zero-Discrepancy (sai số = 0) và bản ký phát hành chính thức."; Color = $cDarkGreen },
    @{ Folder = "_SYNC_CONTROL/"; Role = "Giao Thức Điều Phối"; Owner = "Toàn Bộ Agent (Queue)"; Desc = "Lưu file task_manifest.json và các cờ pipeline.lock quản lý hàng đợi thực thi."; Color = (To-Rgb 100 116 139) }
)

for ($i=0; $i -lt 6; $i++) {
    $fy = 120 + ($i * 62)
    $row = $s4.Shapes.AddShape(5, 45, $fy, 870, 54)
    $row.Fill.Solid()
    $row.Fill.ForeColor.RGB = $cWhite
    $row.Line.ForeColor.RGB = $cBorder
    $row.Line.Weight = 1
    
    # Left tag / folder name
    $fName = $s4.Shapes.AddShape(5, 55, $fy + 8, 220, 38)
    $fName.Fill.Solid()
    $fName.Fill.ForeColor.RGB = (To-Rgb 241 245 249)
    $fName.Line.ForeColor.RGB = $folders[$i].Color
    $fName.Line.Weight = 1.2
    $fnRange = $fName.TextFrame.TextRange
    $fnRange.Text = $folders[$i].Folder
    $fnRange.Font.Name = "Consolas"
    $fnRange.Font.Size = 12
    $fnRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $fnRange.Font.Color.RGB = $folders[$i].Color
    
    # Role Badge
    $fRole = $s4.Shapes.AddShape(5, 290, $fy + 12, 170, 30)
    $fRole.Fill.Solid()
    $fRole.Fill.ForeColor.RGB = $folders[$i].Color
    $fRole.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $frRange = $fRole.TextFrame.TextRange
    $frRange.Text = $folders[$i].Role
    $frRange.Font.Name = "Segoe UI"
    $frRange.Font.Size = 9
    $frRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $frRange.Font.Color.RGB = $cWhite
    
    # Owner & Description
    $fDesc = $s4.Shapes.AddTextbox(1, 475, $fy + 5, 430, 44)
    $fDesc.TextFrame.MarginLeft = 0; $fDesc.TextFrame.MarginTop = 0
    $fDesc.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $fdRange = $fDesc.TextFrame.TextRange
    $fdRange.Text = "Phụ trách: $($folders[$i].Owner)`n$($folders[$i].Desc)"
    $fdRange.Font.Name = "Segoe UI"
    $fdRange.Font.Size = 10
    $fdRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $fdRange.Font.Color.RGB = (To-Rgb 51 65 85)
    $fdRange.Paragraphs(1).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
}

# ==========================================
# SLIDE 5: MA TRAN RACI CHO CAC AGENT
# ==========================================
Write-Host "Dang tao Slide 5: Ma Tran RACI..."
$s5 = New-CustomSlide $cLightBg
Add-SlideHeader $s5 "PHÂN BỔ TRÁCH NHIỆM CHUYÊN BIỆT" "Mỗi Agent Giữ Một Chốt Chặn Độc Lập Theo Ma Trận RACI Để Triệt Tiêu Chồng Chéo Nhiệm Vụ"

$agents = @(
    @{ Name = "ai4a-brainstorm & Lead"; Role = "Orchestrator"; Task = "Khảo sát yêu cầu, chia nhỏ sub-tasks, phát hành vé task_manifest.json, theo dõi tiến độ tổng thể."; Tag = "Điều Phối"; Color = (To-Rgb 100 116 139) },
    @{ Name = "ai4a-data-cleaner"; Role = "Data Engineer"; Task = "Khử trùng lặp, xử lý missing value, chuẩn hóa schema UTF-8, chuyển đổi kiểu số an toàn không chia cho 0."; Tag = "Làm Sạch"; Color = $cGreen },
    @{ Name = "ai4a-dashboard-architect"; Role = "BI Specialist"; Task = "Mô hình hóa Fact/Dim, xây dựng Pre-aggregation Engine giảm 50MB -> 1.5MB, dựng UI Single-file HTML."; Tag = "Kiến Trúc"; Color = $cBlue },
    @{ Name = "ai4a-qa-auditor"; Role = "Quality Gatekeeper"; Task = "Kiểm toán đối soát số học Zero Discrepancy = 0, quét lỗi bảo mật, test hiệu năng tải mượt mà trên Mobile."; Tag = "Kiểm Toán"; Color = $cRed },
    @{ Name = "ai4a-software-engineer"; Role = "Systems Engineer"; Task = "Standby điều tra nguyên nhân gốc rễ (RCA), gỡ lỗi runtime, memory leak và phát hành Minimal Invasive Patch."; Tag = "Gỡ Lỗi"; Color = $cAmber }
)

for ($i=0; $i -lt 5; $i++) {
    $ay = 125 + ($i * 74)
    $card = $s5.Shapes.AddShape(5, 45, $ay, 870, 64)
    $card.Fill.Solid()
    $card.Fill.ForeColor.RGB = $cWhite
    $card.Line.ForeColor.RGB = $cBorder
    $card.Line.Weight = 1.1
    
    # Left vertical indicator bar
    $vBar = $s5.Shapes.AddShape(1, 45, $ay, 6, 64)
    $vBar.Fill.Solid()
    $vBar.Fill.ForeColor.RGB = $agents[$i].Color
    $vBar.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
    
    # Agent Name & Role
    $aBox = $s5.Shapes.AddTextbox(1, 65, $ay + 10, 240, 45)
    $aBox.TextFrame.MarginLeft = 0; $aBox.TextFrame.MarginTop = 0
    $ar = $aBox.TextFrame.TextRange
    $ar.Text = "$($agents[$i].Name)`nVai trò: $($agents[$i].Role)"
    $ar.Font.Name = "Segoe UI"
    $ar.Font.Size = 12
    $ar.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $ar.Font.Color.RGB = $cTextDark
    $ar.Paragraphs(2).Font.Size = 10
    $ar.Paragraphs(2).Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $ar.Paragraphs(2).Font.Color.RGB = $cTextMuted
    
    # Tag badge
    $tag = $s5.Shapes.AddShape(5, 320, $ay + 18, 90, 26)
    $tag.Fill.Solid()
    $tag.Fill.ForeColor.RGB = $agents[$i].Color
    $tag.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $tr = $tag.TextFrame.TextRange
    $tr.Text = $agents[$i].Tag
    $tr.Font.Name = "Segoe UI"
    $tr.Font.Size = 9
    $tr.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $tr.Font.Color.RGB = $cWhite
    
    # Task detail
    $tBox = $s5.Shapes.AddTextbox(1, 425, $ay + 10, 480, 45)
    $tBox.TextFrame.MarginLeft = 0; $tBox.TextFrame.MarginTop = 0
    $tBox.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $tRange = $tBox.TextFrame.TextRange
    $tRange.Text = $agents[$i].Task
    $tRange.Font.Name = "Segoe UI"
    $tRange.Font.Size = 10.5
    $tRange.Font.Color.RGB = (To-Rgb 51 65 85)
}

# ==========================================
# SLIDE 6: GIAO THUC KHOA TEP & BAN GIAO
# ==========================================
Write-Host "Dang tao Slide 6: Giao Thuc Khoa Tep..."
$s6 = New-CustomSlide $cLightBg
Add-SlideHeader $s6 "GIAO THỨC ĐIỀU PHỐI LIÊN AGENT" "Quy Trình Hand-off 4 Bước Đảm Bảo Agent Sau Chỉ Xử Lý Khi Có Chứng Nhận PASSED Của QA Auditor"

$steps = @(
    @{ Num = "BƯỚC 1"; Head = "Claim Task & Ghi Khóa Lock"; Sub = "Ghi file .pipeline.lock vào thư mục _SYNC_CONTROL để báo hiệu đang chiếm quyền"; Color = $cBlue },
    @{ Num = "BƯỚC 2"; Head = "Xử Lý Độc Lập Ra File Tạm"; Sub = "Xuất bản file kết quả nháp dạng temp_output.json, không ghi đè vào thư mục đích"; Color = $cAmber },
    @{ Num = "BƯỚC 3"; Head = "QA Auditor Đối Soát Cấp Pass"; Sub = "Chạy script kiểm toán sai số = 0; nếu fail trả lại, nếu đạt cấp chứng chỉ audit_status=PASSED"; Color = $cRed },
    @{ Num = "BƯỚC 4"; Head = "Thăng Hạng & Mở Khóa Chuyển"; Sub = "Đổi tên file chính thức, xóa file lock và kích hoạt task tiếp theo trong manifest.json"; Color = $cGreen }
)

for ($i=0; $i -lt 4; $i++) {
    $sx = 45 + ($i * 220)
    $box = $s6.Shapes.AddShape(5, $sx, 130, 205, 360)
    $box.Fill.Solid()
    $box.Fill.ForeColor.RGB = $cWhite
    $box.Line.ForeColor.RGB = $cBorder
    $box.Line.Weight = 1.2
    
    # Step header
    $sHead = $s6.Shapes.AddShape(1, $sx, 130, 205, 45)
    $sHead.Fill.Solid()
    $sHead.Fill.ForeColor.RGB = $steps[$i].Color
    $sHead.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $shRange = $sHead.TextFrame.TextRange
    $shRange.Text = $steps[$i].Num
    $shRange.Font.Name = "Segoe UI"
    $shRange.Font.Size = 11
    $shRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $shRange.Font.Color.RGB = $cWhite
    
    # Title
    $stTitle = $s6.Shapes.AddTextbox(1, $sx + 10, 190, 185, 55)
    $stTitle.TextFrame.MarginLeft = 0; $stTitle.TextFrame.MarginTop = 0
    $stTitle.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $str = $stTitle.TextFrame.TextRange
    $str.Text = $steps[$i].Head
    $str.Font.Name = "Segoe UI"
    $str.Font.Size = 13
    $str.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $str.Font.Color.RGB = $cTextDark
    
    # Body
    $stBody = $s6.Shapes.AddTextbox(1, $sx + 10, 260, 185, 210)
    $stBody.TextFrame.MarginLeft = 0; $stBody.TextFrame.MarginTop = 0
    $stBody.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
    $sbr = $stBody.TextFrame.TextRange
    $sbr.Text = $steps[$i].Sub
    $sbr.Font.Name = "Segoe UI"
    $sbr.Font.Size = 11
    $sbr.Font.Color.RGB = (To-Rgb 71 85 105)
}

# ==========================================
# SLIDE 7: PRE-AGGREGATION STRATEGY
# ==========================================
Write-Host "Dang tao Slide 7: Chien Luoc Pre-aggregation..."
$s7 = New-CustomSlide $cLightBg
Add-SlideHeader $s7 "TỐI ƯU HÓA HIỆU NĂNG DASHBOARD" "Nén Dữ Liệu Đa Chiều Giúp Thu Gọn Kích Thước File 97%, Đạt Tốc Độ Mở Trang Dưới 0.5 Giây Trên Mobile"

# Cot Trai: Cach truyen thong
$cLeft = $s7.Shapes.AddShape(5, 45, 125, 420, 365)
$cLeft.Fill.Solid()
$cLeft.Fill.ForeColor.RGB = (To-Rgb 254 242 242)
$cLeft.Line.ForeColor.RGB = (To-Rgb 254 202 202)
$cLeft.Line.Weight = 1.2

$clHeader = $s7.Shapes.AddShape(1, 45, 125, 420, 40)
$clHeader.Fill.Solid()
$clHeader.Fill.ForeColor.RGB = $cRed
$clHeader.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
$clhRange = $clHeader.TextFrame.TextRange
$clhRange.Text = "❌  CÁCH LÀM TRUYỀN THỐNG: ĐẨY FILE THÔ LÊN WEB"
$clhRange.Font.Name = "Segoe UI"
$clhRange.Font.Size = 11
$clhRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
$clhRange.Font.Color.RGB = $cWhite

$clBody = $s7.Shapes.AddTextbox(1, 65, 180, 380, 290)
$clBody.TextFrame.MarginLeft = 0; $clBody.TextFrame.MarginTop = 0
$clBody.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
$clbRange = $clBody.TextFrame.TextRange
$clbRange.Text = "• Dung lượng payload khổng lồ: 50MB – 150MB file thô`n`n• Trình duyệt tải mất 15 – 30 giây mới hiển thị biểu đồ`n`n• Trình duyệt mobile bị cạn RAM, thường xuyên crash đơ tab`n`n• Chi phí băng thông mạng tăng vọt khi nhiều quản lý cùng xem`n`n• Lãnh đạo không thể mở báo cáo khi đi công tác ngoài thị trường"
$clbRange.Font.Name = "Segoe UI"
$clbRange.Font.Size = 11.5
$clbRange.Font.Color.RGB = (To-Rgb 69 10 10)

# Cot Phai: Chuan AI4A
$cRight = $s7.Shapes.AddShape(5, 495, 125, 420, 365)
$cRight.Fill.Solid()
$cRight.Fill.ForeColor.RGB = (To-Rgb 236 253 245)
$cRight.Line.ForeColor.RGB = (To-Rgb 167 243 208)
$cRight.Line.Weight = 1.2

$crHeader = $s7.Shapes.AddShape(1, 495, 125, 420, 40)
$crHeader.Fill.Solid()
$crHeader.Fill.ForeColor.RGB = $cGreen
$crHeader.Line.Visible = [Microsoft.Office.Core.MsoTriState]::msoFalse
$crhRange = $crHeader.TextFrame.TextRange
$crhRange.Text = "✅  CHUẨN AI4A: PRE-AGGREGATION ENGINE < 1.5MB"
$crhRange.Font.Name = "Segoe UI"
$crhRange.Font.Size = 11
$crhRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
$crhRange.Font.Color.RGB = $cWhite

$crBody = $s7.Shapes.AddTextbox(1, 515, 180, 380, 290)
$crBody.TextFrame.MarginLeft = 0; $crBody.TextFrame.MarginTop = 0
$crBody.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
$crbRange = $crBody.TextFrame.TextRange
$crbRange.Text = "• Nén dữ liệu giảm 97%: Payload cuối cùng chỉ còn 1.2MB`n`n• Thời gian tải tức thì < 0.5s trên mọi đường truyền di động`n`n• Tiền tổng hợp theo Fact/Dim: Chi nhánh, Tuần, Nhóm SKU`n`n• Tích hợp bộ công cụ tác chiến Zalo (xuất thẻ ảnh 30s, copy 1 chạm)`n`n• Single-file HTML độc lập: Mở offline không cần cài đặt thêm server"
$crbRange.Font.Name = "Segoe UI"
$crbRange.Font.Size = 11.5
$crbRange.Font.Color.RGB = (To-Rgb 6 78 59)

# ==========================================
# SLIDE 8: LO TRINH & CHECKLIST NGHIEM THU (Dark Executive)
# ==========================================
Write-Host "Dang tao Slide 8: Lo Trinh & Checklist..."
$s8 = New-CustomSlide $cDarkBg
Add-SlideHeader $s8 "LỘ TRÌNH TRIỂN KHAI & CHECKLIST" "Hoàn Tất Bàn Giao Dashboard Trong 4 Giai Đoạn Chặt Chẽ Với Chữ Ký Nghiệm Thu Của QA Auditor" $true

# Left side: Timeline 4 giai doan
$tBoxLeft = $s8.Shapes.AddShape(5, 45, 125, 420, 365)
$tBoxLeft.Fill.Solid()
$tBoxLeft.Fill.ForeColor.RGB = (To-Rgb 30 41 59)
$tBoxLeft.Line.ForeColor.RGB = (To-Rgb 51 65 85)
$tBoxLeft.Line.Weight = 1

$th = $s8.Shapes.AddTextbox(1, 65, 140, 380, 30)
$th.TextFrame.TextRange.Text = "LỘ TRÌNH 4 GIAI ĐOẠN SPRINT"
$th.TextFrame.TextRange.Font.Name = "Segoe UI"
$th.TextFrame.TextRange.Font.Size = 13
$th.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
$th.TextFrame.TextRange.Font.Color.RGB = $cBlue

$tSteps = @(
    "Giai đoạn 1 (D1): Setup 5 folder Drive & khởi tạo task_manifest.json",
    "Giai đoạn 2 (D2): Data Cleaner làm sạch và kiểm toán schema UTF-8",
    "Giai đoạn 3 (D3): Dashboard Architect tạo Data Cubes & dựng Single HTML",
    "Giai đoạn 4 (D4): QA Auditor đối soát sai số = 0 & phát hành cho BOD"
)
$tBody = $s8.Shapes.AddTextbox(1, 65, 180, 380, 290)
$tBody.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
$tbr = $tBody.TextFrame.TextRange
$tbr.Text = ($tSteps | ForEach-Object { "▶  $_" }) -join "`n`n"
$tbr.Font.Name = "Segoe UI"
$tbr.Font.Size = 11.5
$tbr.Font.Color.RGB = (To-Rgb 226 232 240)

# Right side: Checklist
$cBoxRight = $s8.Shapes.AddShape(5, 495, 125, 420, 365)
$cBoxRight.Fill.Solid()
$cBoxRight.Fill.ForeColor.RGB = (To-Rgb 30 41 59)
$cBoxRight.Line.ForeColor.RGB = (To-Rgb 51 65 85)
$cBoxRight.Line.Weight = 1

$ch = $s8.Shapes.AddTextbox(1, 515, 140, 380, 30)
$ch.TextFrame.TextRange.Text = "CHECKLIST NGHIỆM THU TRƯỚC KHI BÀN GIAO"
$ch.TextFrame.TextRange.Font.Name = "Segoe UI"
$ch.TextFrame.TextRange.Font.Size = 13
$ch.TextFrame.TextRange.Font.Bold = [Microsoft.Office.Core.MsoTriState]::msoTrue
$ch.TextFrame.TextRange.Font.Color.RGB = $cGreen

$cItems = @(
    "[v] Không còn file .pipeline.lock tồn đọng trên Google Drive",
    "[v] Dung lượng file Single HTML Dashboard cuối cùng < 1.5MB",
    "[v] Báo cáo đối soát reconciliation đạt độ lệch chính xác 0.00%",
    "[v] Đã kiểm tra mở mượt mà trên Google Chrome Mobile & Safari",
    "[v] Bộ công cụ Zalo xuất ảnh thẻ 30s và copy tin nhắn hoạt động tốt"
)
$cBody = $s8.Shapes.AddTextbox(1, 515, 180, 380, 290)
$cBody.TextFrame.WordWrap = [Microsoft.Office.Core.MsoTriState]::msoTrue
$cbr = $cBody.TextFrame.TextRange
$cbr.Text = ($cItems -join "`n`n")
$cbr.Font.Name = "Segoe UI"
$cbr.Font.Size = 11.5
$cbr.Font.Color.RGB = (To-Rgb 226 232 240)

# ==========================================
# LUU FILE PPTX
# ==========================================
$outputPath = "D:\NTAN\AI For work\Agentic\my-workspace\Test Skill\huong-dan-dashboard-multi-agent.pptx"
Write-Host "Dang luu file vao: $outputPath ..."
$pres.SaveAs($outputPath)
$pres.Close()
$ppt.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "Xuat ban thanh cong file PowerPoint tai: $outputPath"
