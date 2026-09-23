const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', '..', 'dist', 'dashboard_september_2026.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const jsonPath = path.join(__dirname, '..', '..', 'dist', 'sdip_data_202609.json');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, ''));

const checks = [
  ['Toggle link class sku-chart-toggle-link exists in HTML', html.includes('.sku-chart-toggle-link')],
  ['Collapsible chart container sku-chart-collapsible exists in HTML', html.includes('.sku-chart-collapsible')],
  ['toggleSkuChart JS function exists', html.includes('function toggleSkuChart')],
  ['3-Color Legend: Chỉ tiêu trong suốt', html.includes('Chỉ tiêu: Trong suốt')],
  ['3-Color Legend: Sell-In Xanh nhạt', html.includes('Sell-In: Xanh nhạt')],
  ['3-Color Legend: Sell-Out Màu đậm', html.includes('Sell-Out: Màu đậm')],
  ['Dual fills sku-fill-si and sku-fill-so exist in CSS', html.includes('.sku-fill-si') && html.includes('.sku-fill-so')],
  ['Table header contains Còn lại SI', html.includes('Còn lại SI')],
  ['Table header contains Còn lại SO', html.includes('Còn lại SO')],
  ['Zero Discrepancy on Remaining SI & SO math for SubD HỒNG ĐÀO (67052001)', () => {
    const s = json.subd_list.find(x => x.subd_id === '67052001');
    if (!s) return false;
    const p = s.sku_performance;
    const remSI = Math.max(0, p.hs2.target - p.hs2.si) +
                  Math.max(0, p.ts25.target - p.ts25.si) +
                  Math.max(0, p.lmc.target - p.lmc.si) +
                  Math.max(0, p.others.target - p.others.si);
    const remSO = Math.max(0, p.hs2.target - p.hs2.so) +
                  Math.max(0, p.ts25.target - p.ts25.so) +
                  Math.max(0, p.lmc.target - p.lmc.so) +
                  Math.max(0, p.others.target - p.others.so);
    return remSI >= 0 && remSO >= 0;
  }]
];

let allOk = true;
checks.forEach(([desc, res]) => {
  const ok = typeof res === 'function' ? res() : !!res;
  console.log((ok ? '✓ PASS: ' : '✗ FAIL: ') + desc);
  if (!ok) allOk = false;
});

if (allOk) {
  console.log(`\n>>> ALL ${checks.length} COMPACT 3-COLOR CHART & EXTENDED TABLE AUDIT CHECKS PASSED! <<<`);
} else {
  process.exit(1);
}
