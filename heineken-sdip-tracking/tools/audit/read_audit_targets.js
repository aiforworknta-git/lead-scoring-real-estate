const fs = require('fs');

let raw = fs.readFileSync('d:/NTAN/AI For work/Agentic/excel_audit_targets.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) {
  raw = raw.slice(1);
}
const data = JSON.parse(raw);
console.log('Total Target items:', data.length);
data.forEach((d, idx) => {
  console.log(`\n======================================================`);
  console.log(`[${idx+1}] [${d.Category}] ${d.FileName} (${d.SizeKB} KB)`);
  console.log(`Sheet: '${d.Sheet}' | Rows: ${d.Rows} | Cols: ${d.Cols}`);
  console.log(`First 15 Headers:`);
  if (d.Headers) {
    d.Headers.split(' | ').slice(0, 15).forEach((h, i) => console.log(`   ${i+1}. ${h}`));
  }
  console.log(`Sample: ${d.Sample ? d.Sample.substring(0, 200) : 'none'}`);
});
