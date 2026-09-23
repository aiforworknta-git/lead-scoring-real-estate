const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', '01_Data', 'healthcare_executive_payroll_24m.json');
const records = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// 1. Total payroll 24m
let totalGross24M = 0;
let totalP1_24M = 0;
let totalP2_24M = 0;
let totalP3_24M = 0;
let totalBonus_24M = 0;
let totalNet24M = 0;
let totalRevenue24M = 0;
let totalSurgeries24M = 0;

let y2024 = { gross: 0, p1: 0, p2: 0, p3: 0, bonus: 0, net: 0, count: 0, rev: 0 };
let y2025 = { gross: 0, p1: 0, p2: 0, p3: 0, bonus: 0, net: 0, count: 0, rev: 0 };

const monthlySummary = {};
const execSummary = {};

records.forEach(r => {
  totalGross24M += r.gross_salary;
  totalP1_24M += r.p1_position_salary;
  totalP2_24M += r.p2_competency_salary;
  totalP3_24M += r.p3_total;
  totalBonus_24M += r.tet_annual_bonus;
  totalNet24M += r.net_salary;
  totalRevenue24M += r.department_revenue;
  totalSurgeries24M += r.surgical_cases_count;

  const yTarget = r.year === 2024 ? y2024 : y2025;
  yTarget.gross += r.gross_salary;
  yTarget.p1 += r.p1_position_salary;
  yTarget.p2 += r.p2_competency_salary;
  yTarget.p3 += r.p3_total;
  yTarget.bonus += r.tet_annual_bonus;
  yTarget.net += r.net_salary;
  yTarget.count++;
  yTarget.rev += r.department_revenue;

  // Monthly
  if (!monthlySummary[r.month_id]) {
    monthlySummary[r.month_id] = {
      month_id: r.month_id,
      year: r.year,
      quarter: r.quarter,
      gross: 0,
      p1: 0,
      p2: 0,
      p3: 0,
      bonus: 0,
      net: 0,
      revenue: 0,
      surgeries: 0
    };
  }
  monthlySummary[r.month_id].gross += r.gross_salary;
  monthlySummary[r.month_id].p1 += r.p1_position_salary;
  monthlySummary[r.month_id].p2 += r.p2_competency_salary;
  monthlySummary[r.month_id].p3 += r.p3_total;
  monthlySummary[r.month_id].bonus += r.tet_annual_bonus;
  monthlySummary[r.month_id].net += r.net_salary;
  monthlySummary[r.month_id].revenue += r.department_revenue;
  monthlySummary[r.month_id].surgeries += r.surgical_cases_count;

  // Executive
  if (!execSummary[r.exec_id]) {
    execSummary[r.exec_id] = {
      exec_id: r.exec_id,
      name: r.full_name,
      title: r.academic_title,
      position: r.position,
      department: r.department,
      totalGross: 0,
      avgGrossPerMonth: 0,
      totalP1: 0,
      totalP2: 0,
      totalP3: 0,
      totalBonus: 0,
      totalNet: 0,
      totalRevenue: 0,
      totalSurgeries: 0
    };
  }
  execSummary[r.exec_id].totalGross += r.gross_salary;
  execSummary[r.exec_id].totalP1 += r.p1_position_salary;
  execSummary[r.exec_id].totalP2 += r.p2_competency_salary;
  execSummary[r.exec_id].totalP3 += r.p3_total;
  execSummary[r.exec_id].totalBonus += r.tet_annual_bonus;
  execSummary[r.exec_id].totalNet += r.net_salary;
  execSummary[r.exec_id].totalRevenue += r.department_revenue;
  execSummary[r.exec_id].totalSurgeries += r.surgical_cases_count;
});

Object.values(execSummary).forEach(e => {
  e.avgGrossPerMonth = Math.round(e.totalGross / 24);
  e.p1Ratio = Math.round((e.totalP1 / e.totalGross) * 1000) / 10;
  e.p2Ratio = Math.round((e.totalP2 / e.totalGross) * 1000) / 10;
  e.p3Ratio = Math.round((e.totalP3 / e.totalGross) * 1000) / 10;
  e.roiRatio = Math.round((e.totalRevenue / e.totalGross) * 10) / 10;
});

const sortedExecs = Object.values(execSummary).sort((a, b) => b.totalGross - a.totalGross);

const analyticsOutput = {
  macro: {
    total_payroll_24m: totalGross24M,
    total_payroll_net_24m: totalNet24M,
    total_revenue_clinical_24m: totalRevenue24M,
    total_surgeries_24m: totalSurgeries24M,
    overall_payroll_to_revenue_pct: Math.round((totalGross24M / totalRevenue24M) * 1000) / 10,
    structure: {
      p1_pct: Math.round((totalP1_24M / totalGross24M) * 1000) / 10,
      p2_pct: Math.round((totalP2_24M / totalGross24M) * 1000) / 10,
      p3_pct: Math.round((totalP3_24M / totalGross24M) * 1000) / 10,
      bonus_pct: Math.round((totalBonus_24M / totalGross24M) * 1000) / 10
    },
    y2024: {
      gross: y2024.gross,
      avg_monthly_exec: Math.round(y2024.gross / 144),
      p1: y2024.p1,
      p2: y2024.p2,
      p3: y2024.p3,
      bonus: y2024.bonus
    },
    y2025: {
      gross: y2025.gross,
      avg_monthly_exec: Math.round(y2025.gross / 144),
      p1: y2025.p1,
      p2: y2025.p2,
      p3: y2025.p3,
      bonus: y2025.bonus,
      yoy_growth_pct: Math.round(((y2025.gross - y2024.gross) / y2024.gross) * 1000) / 10
    }
  },
  executives_ranked: sortedExecs,
  monthly_timeline: Object.values(monthlySummary)
};

const outDir = path.join(__dirname);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const jsonOut = path.join(outDir, 'payroll_analytics_summary.json');
fs.writeFileSync(jsonOut, JSON.stringify(analyticsOutput, null, 2), 'utf8');

console.log('--- PAYROLL ANALYTICS ENGINE COMPLETED ---');
console.log('Total 24M Executive Payroll:', (totalGross24M / 1000000000).toFixed(2), 'Billion VND');
console.log('2024 Payroll:', (y2024.gross / 1000000000).toFixed(2), 'B VND | 2025 Payroll:', (y2025.gross / 1000000000).toFixed(2), 'B VND (YoY: +' + analyticsOutput.macro.y2025.yoy_growth_pct + '%)');
console.log('Structure: P1 =', analyticsOutput.macro.structure.p1_pct + '%, P2 =', analyticsOutput.macro.structure.p2_pct + '%, P3 =', analyticsOutput.macro.structure.p3_pct + '%, Tet Bonus =', analyticsOutput.macro.structure.bonus_pct + '%');
console.log('Payroll / Clinical Revenue Ratio:', analyticsOutput.macro.overall_payroll_to_revenue_pct + '%');
console.log('Top Earner:', sortedExecs[0].title, sortedExecs[0].name, 'Avg Gross:', (sortedExecs[0].avgGrossPerMonth / 1000000).toFixed(1), 'M/month');
