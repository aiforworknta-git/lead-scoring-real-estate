const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', '..', 'dist', 'dashboard_september_2026.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const checks = [
  ['app-layout container', html.includes('class="app-layout"')],
  ['app-sidebar aside', html.includes('class="app-sidebar"')],
  ['brand logo and name', html.includes('HEINEKEN') && html.includes('SDIP TRACKING')],
  ['tabOverview button', html.includes("switchTab('tabOverview')")],
  ['tabAABB button', html.includes("switchTab('tabAABB')")],
  ['tabSubDs button', html.includes("switchTab('tabSubDs')")],
  ['tabASO button', html.includes("switchTab('tabASO')")],
  ['tabInfoMap in script', html.includes('tabInfoMap')],
  ['topbar breadcrumb element', html.includes('id="breadcrumbCurrent"')],
  ['topbar title element', html.includes('id="pageTitleCurrent"')],
  ['no old nav-tabs bar', !html.includes('class="nav-tabs"')],
  ['tab 1 section present', html.includes('id="tabOverview"')],
  ['tab 2 section present', html.includes('id="tabAABB"')],
  ['tab 3 section present', html.includes('id="tabSubDs"')],
  ['tab 4 section present', html.includes('id="tabASO"')]
];

let allOk = true;
checks.forEach(([name, passed]) => {
  console.log((passed ? '✓ PASS: ' : '✗ FAIL: ') + name);
  if (!passed) allOk = false;
});

if (allOk) {
  console.log('\n>>> ALL 15 STRUCTURAL & CONTENT CHECKS PASSED! <<<');
} else {
  process.exit(1);
}
