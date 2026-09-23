const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', '..', 'dist', 'dashboard_september_2026.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  ['Vol T7 in table header', html.includes('Vol T7 (thùng)')],
  ['Vol T8 in table header', html.includes('Vol T8 (thùng)')],
  ['Vol T9 in table header', html.includes('Vol T9 (thùng)')],
  ['Mức Độ Cảnh Báo in header', html.includes('Mức Độ Cảnh Báo')],
  ['Old "Hành Động" column removed from ASO table', !html.includes('<th style="text-align: center; white-space: nowrap;">Hành Động</th>')],
  ['Warning filter pills exist', html.includes('filterASOWarning')],
  ['Quick filter button HIGH_3M exists', html.includes('btnWarnHigh')],
  ['Quick filter button CHURN_RISK exists', html.includes('btnWarnChurn')],
  ['High warning badge text exists in script', html.includes('🔴 3T Không Mua (Cảnh Báo Cao)')],
  ['Churn risk badge text exists in script', html.includes('🟡 Chưa Mua T9 (T7-T8 Có)')],
  ['CSV export includes Vol_T7 and Warning_Level', html.includes("'Vol_T7', 'Vol_T8', 'Vol_T9', 'Warning_Level'")]
];

let allPassed = true;
checks.forEach(([desc, ok]) => {
  console.log((ok ? '✓ PASS: ' : '✗ FAIL: ') + desc);
  if (!ok) allPassed = false;
});

if (allPassed) {
  console.log('\n>>> ALL 11 ASO 3-MONTH VOLUME & CHURN WARNING CHECKS PASSED! <<<');
} else {
  process.exit(1);
}
