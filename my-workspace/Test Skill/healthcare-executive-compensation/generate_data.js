const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '01_Data');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const executives = [
  {
    id: "EXEC01",
    name: "Trần Văn Hùng",
    title: "GS.TS.BS",
    position: "Giám Đốc Bệnh Viện (CEO / CMO)",
    dept: "Ban Điều Hành",
    baseP1: 120000000,
    baseP2: 50000000,
    minP3: 85000000,
    maxP3: 140000000,
    revBase: 25000000000 // Total hospital revenue oversight
  },
  {
    id: "EXEC02",
    name: "Lê Thị Mai Hoa",
    title: "PGS.TS.BS",
    position: "Phó Giám Đốc Chuyên Môn Khối Nội",
    dept: "Khối Nội & Nhi",
    baseP1: 90000000,
    baseP2: 45000000,
    minP3: 70000000,
    maxP3: 120000000,
    revBase: 8500000000
  },
  {
    id: "EXEC03",
    name: "Nguyễn Hoàng Nam",
    title: "TS.BS.CKII",
    position: "Phó Giám Đốc Chuyên Môn Khối Ngoại",
    dept: "Khối Ngoại & Gây Mê",
    baseP1: 90000000,
    baseP2: 40000000,
    minP3: 95000000,
    maxP3: 160000000,
    revBase: 12000000000
  },
  {
    id: "EXEC04",
    name: "Vũ Hoài An",
    title: "TS.BS.CKII",
    position: "Trưởng Khoa Phẫu Thuật Tim Mạch - Lồng Ngực",
    dept: "Khoa Ngoại Tim Mạch",
    baseP1: 80000000,
    baseP2: 35000000,
    minP3: 100000000,
    maxP3: 180000000,
    revBase: 6500000000
  },
  {
    id: "EXEC05",
    name: "Đỗ Hoàng Long",
    title: "BSCKII",
    position: "Trưởng Khoa Can Thiệp Tim Mạch & Đột Quỵ",
    dept: "Khoa Tim Mạch Can Thiệp",
    baseP1: 75000000,
    baseP2: 30000000,
    minP3: 90000000,
    maxP3: 165000000,
    revBase: 5800000000
  },
  {
    id: "EXEC06",
    name: "Phạm Đức Minh",
    title: "ThS.BS.CKII",
    position: "Trưởng Khoa Hồi Sức Tích Cực & Cấp Cứu (ICU)",
    dept: "Khoa ICU & Cấp Cứu",
    baseP1: 75000000,
    baseP2: 30000000,
    minP3: 65000000,
    maxP3: 115000000,
    revBase: 4200000000
  },
  {
    id: "EXEC07",
    name: "Đặng Thị Cẩm Tú",
    title: "BSCKII",
    position: "Trưởng Khoa Phụ Sản & Hỗ Trợ Sinh Sản (IVF)",
    dept: "Khoa Phụ Sản - IVF",
    baseP1: 75000000,
    baseP2: 30000000,
    minP3: 85000000,
    maxP3: 155000000,
    revBase: 6200000000
  },
  {
    id: "EXEC08",
    name: "Bùi Quang Vinh",
    title: "TS.BS.CKII",
    position: "Trưởng Khoa Chấn Thương Chỉnh Hình & Cột Sống",
    dept: "Khoa Chấn Thương Chỉnh Hình",
    baseP1: 75000000,
    baseP2: 30000000,
    minP3: 80000000,
    maxP3: 145000000,
    revBase: 5100000000
  },
  {
    id: "EXEC09",
    name: "Nguyễn Thu Trang",
    title: "ThS.BS.CKI",
    position: "Trưởng Khoa Gây Mê Hồi Sức",
    dept: "Khoa Gây Mê Hồi Sức",
    baseP1: 70000000,
    baseP2: 25000000,
    minP3: 60000000,
    maxP3: 110000000,
    revBase: 3800000000
  },
  {
    id: "EXEC10",
    name: "Phan Thanh Tùng",
    title: "TS.BS",
    position: "Trưởng Khoa Chẩn Đoán Hình Ảnh & Y Học Hạt Nhân",
    dept: "Khoa Chẩn Đoán Hình Ảnh",
    baseP1: 70000000,
    baseP2: 30000000,
    minP3: 50000000,
    maxP3: 95000000,
    revBase: 4500000000
  },
  {
    id: "EXEC11",
    name: "Đỗ Minh Triết",
    title: "ThS. Quản Trị BV",
    position: "Giám Đốc Vận Hành & Trải Nghiệm Bệnh Nhân (COO)",
    dept: "Ban Điều Hành & Vận Hành",
    baseP1: 85000000,
    baseP2: 25000000,
    minP3: 40000000,
    maxP3: 75000000,
    revBase: 25000000000
  },
  {
    id: "EXEC12",
    name: "Hoàng Yến Nhi",
    title: "ThS. CPA",
    position: "Giám Đốc Tài Chính Y Tế (CFO)",
    dept: "Khối Tài Chính Kế Toán",
    baseP1: 80000000,
    baseP2: 25000000,
    minP3: 35000000,
    maxP3: 70000000,
    revBase: 25000000000
  }
];

// Months from 2024-01 to 2025-12 (24 months)
const months = [];
for (let y = 2024; y <= 2025; y++) {
  for (let m = 1; m <= 12; m++) {
    months.push({
      year: y,
      month: m,
      monthStr: `${y}-${m < 10 ? '0' + m : m}`,
      quarter: `Q${Math.ceil(m / 3)}-${y}`,
      seasonFactor: (m === 1 || m === 2 || m === 11 || m === 12) ? 1.15 : (m >= 6 && m <= 8 ? 1.08 : 1.0)
    });
  }
}

// Pseudo-random deterministic generator with seed
let seed = 42;
function random() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

const records = [];

months.forEach((mObj, mIdx) => {
  // Annual raise in 2025: +7% on P1 and P2
  const raiseFactor = mObj.year === 2025 ? 1.07 : 1.0;

  executives.forEach(exec => {
    const p1 = Math.round(exec.baseP1 * raiseFactor);
    const p2 = Math.round(exec.baseP2 * raiseFactor);

    // P3 components: Surgeries/Procedures (50%), Quality/Safety (25%), Revenue Share (25%)
    const p3Base = exec.minP3 + (exec.maxP3 - exec.minP3) * (0.3 + 0.6 * random());
    const p3WithSeason = Math.round(p3Base * mObj.seasonFactor * (mObj.year === 2025 ? 1.06 : 1.0));

    const p3Surgeries = Math.round(p3WithSeason * 0.52);
    const p3QualitySafety = Math.round(p3WithSeason * 0.24);
    const p3RevenueShare = p3WithSeason - p3Surgeries - p3QualitySafety;
    const p3Total = p3Surgeries + p3QualitySafety + p3RevenueShare;

    // Tet Holiday bonus in Month 1 (or 12)
    let bonusTet = 0;
    if (mObj.month === 1) {
      bonusTet = Math.round((p1 + p2) * 1.5); // 1.5 months salary Tet bonus
    }

    const grossSalary = p1 + p2 + p3Total + bonusTet;

    // Mandatory Insurance: Max base is 20 times statutory minimum wage (~36M/46M)
    const insuranceBase = mObj.year === 2024 ? 36000000 : 46800000;
    const insuranceDeduction = Math.round(insuranceBase * 0.105); // 8% BHXH + 1.5% BHYT + 1% BHTN

    // PIT progressive estimate (~28% - 32% effective on high gross)
    const taxableIncome = Math.max(0, grossSalary - insuranceDeduction - 11000000 - 8800000); // 2 dependents
    const pitTax = Math.round(taxableIncome * 0.31);
    const netSalary = grossSalary - insuranceDeduction - pitTax;

    const surgeriesCount = Math.round((p3Surgeries / 3500000) * (0.8 + 0.4 * random()));
    const satisfactionRate = Math.round((95 + random() * 4.5) * 10) / 10;
    const deptRevenue = Math.round(exec.revBase * mObj.seasonFactor * (0.95 + 0.1 * random()) * (mObj.year === 2025 ? 1.12 : 1.0));

    records.push({
      month_id: mObj.monthStr,
      year: mObj.year,
      month: mObj.month,
      quarter: mObj.quarter,
      exec_id: exec.id,
      full_name: exec.name,
      academic_title: exec.title,
      position: exec.position,
      department: exec.dept,
      p1_position_salary: p1,
      p2_competency_salary: p2,
      p3_surgeries_procedures: p3Surgeries,
      p3_quality_safety: p3QualitySafety,
      p3_dept_revenue_share: p3RevenueShare,
      p3_total: p3Total,
      tet_annual_bonus: bonusTet,
      gross_salary: grossSalary,
      insurance_deduction: insuranceDeduction,
      pit_tax: pitTax,
      net_salary: netSalary,
      surgical_cases_count: surgeriesCount,
      patient_satisfaction_rate: satisfactionRate,
      department_revenue: deptRevenue
    });
  });
});

// Write CSV
const csvHeaders = Object.keys(records[0]).join(',');
const csvRows = records.map(r => Object.values(r).map(v => typeof v === 'string' && v.includes(',') ? `"${v}"` : v).join(','));
const csvContent = '\uFEFF' + [csvHeaders, ...csvRows].join('\n');

const csvPath = path.join(outDir, 'healthcare_executive_payroll_24m.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');

// Write JSON
const jsonPath = path.join(outDir, 'healthcare_executive_payroll_24m.json');
fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');

// Write Dimension JSON
const dimPath = path.join(outDir, 'healthcare_executives_dim.json');
fs.writeFileSync(dimPath, JSON.stringify(executives, null, 2), 'utf8');

console.log('Successfully generated 24-month healthcare executive dataset!');
console.log('Total Records:', records.length, '(24 months x 12 executives)');
console.log('CSV Path:', csvPath);
console.log('JSON Path:', jsonPath);
