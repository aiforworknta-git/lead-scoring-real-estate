const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', '..', 'dist', 'dashboard_september_2026.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const jsonPath = path.join(__dirname, '..', '..', 'dist', 'sdip_data_202609.json');
const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, ''));

const checks = [
  ['getBeerBottleSVG helper exists in HTML', html.includes('function getBeerBottleSVG')],
  ['getSkuHorizontalMatrix helper exists in HTML', html.includes('function getSkuHorizontalMatrix')],
  ['bottles-row class in CSS', html.includes('.bottles-row')],
  ['sku-target-track class in CSS', html.includes('.sku-target-track')],
  ['Transparent Target Track with crisp border', html.includes('background: rgba(241, 245, 249, 0.5); border: 1.5px solid #cbd5e1;')],
  ['fill-hs2 style exists', html.includes('.fill-hs2')],
  ['fill-ts25 style exists', html.includes('.fill-ts25')],
  ['fill-lmc style exists', html.includes('.fill-lmc')],
  ['fill-others style exists', html.includes('.fill-others')],
  ['sku-mini-table exists', html.includes('.sku-mini-table')],
  ['HS2 badge exists in HTML', html.includes('bg-hs2')],
  ['TS25 badge exists in HTML', html.includes('bg-ts25')],
  ['LMC badge exists in HTML', html.includes('bg-lmc')],
  ['JSON has sku_performance on SubDs', json.subd_list && json.subd_list[0].sku_performance !== undefined],
  ['JSON SubD 0 has HS2, TS25, LMC, Others', 
    json.subd_list[0].sku_performance.hs2 && 
    json.subd_list[0].sku_performance.ts25 && 
    json.subd_list[0].sku_performance.lmc && 
    json.subd_list[0].sku_performance.others !== undefined
  ],
  ['Zero Discrepancy on HỒNG ĐÀO (67052001)', () => {
    const s = json.subd_list.find(x => x.subd_id === '67052001');
    if (!s) return false;
    const sumSI = s.sku_performance.hs2.si + s.sku_performance.ts25.si + s.sku_performance.lmc.si + s.sku_performance.others.si;
    const sumSO = s.sku_performance.hs2.so + s.sku_performance.ts25.so + s.sku_performance.lmc.so + s.sku_performance.others.so;
    return Math.abs(sumSI - s.actual_si) < 0.1 && Math.abs(sumSO - s.actual_so) < 0.1;
  }]
];

let allOk = true;
checks.forEach(([desc, res]) => {
  const ok = typeof res === 'function' ? res() : !!res;
  console.log((ok ? '✓ PASS: ' : '✗ FAIL: ') + desc);
  if (!ok) allOk = false;
});

if (allOk) {
  console.log(`\n>>> ALL ${checks.length} BEER BOTTLE & SKU HORIZONTAL MATRIX AUDIT CHECKS PASSED! <<<`);
} else {
  process.exit(1);
}
