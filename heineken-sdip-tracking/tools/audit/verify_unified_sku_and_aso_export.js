const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '../../dist/dashboard_september_2026.html');
console.log('Auditing HTML File:', htmlPath);

if (!fs.existsSync(htmlPath)) {
    console.error('ERROR: dashboard_september_2026.html not found!');
    process.exit(1);
}

const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const stat = fs.statSync(htmlPath);
const sizeKB = stat.size / 1024;
console.log(`File size: ${sizeKB.toFixed(1)} KB`);

let passed = 0;
let failed = 0;

function assert(condition, desc) {
    if (condition) {
        console.log(`  [PASS] ${desc}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${desc}`);
        failed++;
    }
}

// 1. File size < 1.5 MB
assert(sizeKB < 1536, `File size is under 1.5 MB (Actual: ${sizeKB.toFixed(1)} KB)`);

// 2. Syntax check in Node VM
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
let hasSyntaxError = false;

// Mock DOM
const sandbox = {
    console: console,
    document: {
        getElementById: () => ({ innerText: '', innerHTML: '', value: 'ALL', classList: { add: ()=>{}, remove: ()=>{} }, appendChild: ()=>{} }),
        querySelectorAll: () => [],
        createElement: () => ({ value: '', textContent: '', click: ()=>{}, setAttribute: ()=>{} })
    },
    window: { innerWidth: 1200, addEventListener: () => {} },
    addEventListener: () => {},
    navigator: { userAgent: 'Node' },
    ApexCharts: class {},
    lucide: { createIcons: () => {} },
    html2canvas: () => Promise.resolve({ toDataURL: () => '' }),
    URL: { createObjectURL: () => 'blob:mock' },
    Blob: class { constructor(parts) { this.parts = parts; } },
    showToast: () => {}
};
sandbox.window = sandbox;

while ((match = scriptRegex.exec(htmlContent)) !== null) {
    const code = match[1];
    if (code.includes('src=') || code.trim().length === 0) continue;
    try {
        const script = new vm.Script(code);
        const ctx = vm.createContext(sandbox);
        script.runInContext(ctx);
        scriptIdx++;
    } catch (e) {
        console.error(`Syntax Error in script #${scriptIdx}:`, e.message);
        hasSyntaxError = true;
    }
}
assert(!hasSyntaxError, 'All JavaScript inside HTML passed Node VM execution without syntax errors');

// 3. Unified SKU Table in openSubDDetails
assert(htmlContent.includes('1. Bảng Chi Tiết Chỉ Tiêu - Thực Mua (SI) - Tiêu Thụ (SO) - Tồn Kho Từng SKU'), 'Modal contains unified Master SKU Table title');
assert(htmlContent.includes('Mã SKU') && htmlContent.includes('Tên Sản Phẩm') && htmlContent.includes('Chỉ Tiêu'), 'Unified table contains Mã SKU, Tên Sản Phẩm, Chỉ Tiêu');
assert(htmlContent.includes('Thực Mua (SI)') && htmlContent.includes('% Đạt SI') && htmlContent.includes('Còn Lại SI'), 'Unified table contains Thực Mua (SI), % Đạt SI, Còn Lại SI');
assert(htmlContent.includes('Tiêu Thụ (SO)') && htmlContent.includes('Còn Lại SO') && htmlContent.includes('Tồn Kho'), 'Unified table contains Tiêu Thụ (SO), Còn Lại SO, Tồn Kho');
assert(htmlContent.includes('SCD (ngày)') && htmlContent.includes('Trạng Thái'), 'Unified table contains SCD and Trạng Thái');
assert(htmlContent.includes('<tfoot') && htmlContent.includes('TỔNG CỘNG'), 'Unified table contains tfoot with TỔNG CỘNG summary row');

// 4. Modal ASO Table with SE/SR and SS/DSM and Excel export button
assert(htmlContent.includes('2. Danh Sách Quán Active Chưa Có Đơn'), 'Modal contains section 2 for Inactive Outlets');
assert(htmlContent.includes('exportSubDASOExcel'), 'Modal contains exportSubDASOExcel function call');
assert(htmlContent.includes('SR / DSM') && htmlContent.includes('SE / SS'), 'Modal ASO table contains SR/DSM and SE/SS columns');
assert(htmlContent.includes('Doanh Số T7 (thùng)') && htmlContent.includes('Doanh Số T8 (thùng)') && htmlContent.includes('Doanh Số T9 (thùng)'), 'Modal ASO table contains 3 separate columns for T7, T8, T9 volume');

// 5. Tab 4 ASO table with SR/DSM and SE/SS and Excel export button
assert(htmlContent.includes('SR / DSM') && htmlContent.includes('SE / SS'), 'Tab 4 table headers include SR/DSM and SE/SS');
assert(htmlContent.includes('onclick="exportInactiveOutletsCSV()"') && htmlContent.includes('Xuất Excel Danh Sách Đang Lọc'), 'Tab 4 has 1-click Excel export button');

// 6. Excel Exporter functions with UTF-8 BOM
assert(htmlContent.includes('function exportSubDASOExcel(subdId)'), 'exportSubDASOExcel function is implemented');
assert(htmlContent.includes('function exportInactiveOutletsCSV()'), 'exportInactiveOutletsCSV function is implemented');
assert(htmlContent.includes('\\uFEFF') || htmlContent.includes('\uFEFF'), 'CSV export functions include UTF-8 BOM for seamless Excel opening');

// 7. SubD data integrity
const dataMatch = htmlContent.match(/const HEINEKEN_DATA = (\{[\s\S]*?\});\s*\n/);
assert(dataMatch !== null, 'HEINEKEN_DATA successfully parsed from HTML');
if (dataMatch) {
    const data = JSON.parse(dataMatch[1]);
    assert(data.subd_list.length === 103, `Contains all 103 SubDs (Actual: ${data.subd_list.length})`);
    assert(data.inactive_outlets_master.length > 0, `Contains inactive outlets (Actual: ${data.inactive_outlets_master.length})`);
    
    // Check first SubD's SKU list has target, actual_si, actual_so
    const s0 = data.subd_list[0];
    const s0SkusWithTarget = s0.sku_list.filter(k => k.target !== undefined);
    assert(s0SkusWithTarget.length === s0.sku_list.length, `All SKUs in SubD 0 have target field populated (${s0SkusWithTarget.length}/${s0.sku_list.length})`);
    const s0SkusWithSI = s0.sku_list.filter(k => k.actual_si !== undefined);
    assert(s0SkusWithSI.length === s0.sku_list.length, `All SKUs in SubD 0 have actual_si field populated (${s0SkusWithSI.length}/${s0.sku_list.length})`);
    const s0SkusWithSO = s0.sku_list.filter(k => k.actual_so !== undefined);
    assert(s0SkusWithSO.length === s0.sku_list.length, `All SKUs in SubD 0 have actual_so field populated (${s0SkusWithSO.length}/${s0.sku_list.length})`);
}

console.log(`\nAUDIT RESULT: ${passed} PASSED, ${failed} FAILED`);
if (failed > 0) process.exit(1);
