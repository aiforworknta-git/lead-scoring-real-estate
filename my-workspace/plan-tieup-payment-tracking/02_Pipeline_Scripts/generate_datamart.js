// ==============================================================================
// TÁC VỤ 1 & 2: LÀM SẠCH, TÍNH AGING & TẠO DATA MART NÉN (DATA MART GENERATOR)
// ==============================================================================

const fs = require('fs');
const path = require('path');

const scriptDir = __dirname;
const projectRoot = path.join(scriptDir, '..');
const dataMartDir = path.join(projectRoot, '01_Data_Mart');

const rawJsonPath = path.join(dataMartDir, 'plan_payment_data.json');
let rawContent = fs.readFileSync(rawJsonPath, 'utf8').replace(/^\uFEFF/, '');
const raw = JSON.parse(rawContent);

// 1. SubD Plans (37 SubDs)
const subdPlans = raw.plans.slice(0, 37).map((p) => {
  const cleanId = String(p.outlet_id).trim();
  const cleanName = String(p.customer_name).trim();
  const tpo = p.tpo_status === 'TPO' ? 'TPO' : (p.tpo_status === 'Non TPO' ? 'Non TPO' : (p.tpo_status === 'TPO abnormal' ? 'TPO Abnormal' : 'TPO'));
  
  return {
    subd_id: cleanId,
    subd_name: cleanName,
    old_contract: {
      start_date: p.old_start || 'N/A',
      end_date: p.old_end || 'N/A',
      months: p.old_months || 0,
      target_vol: p.old_target || 0,
      oo_amount: p.old_oo_amount || 0,
      pay_count: p.old_pay_count || 0,
      cost_per_case: p.cost_per_case || 0
    },
    new_plan: {
      start_date: p.new_start || 'Chưa chốt',
      end_date: p.new_end || 'Chưa chốt',
      months: p.new_months || 12,
      target_vol: p.new_target || 0,
      pay_times: p.pay_times || 4,
      target_quarter: p.target_quarter || Math.round((p.new_target || 0) / 4),
      target_month: p.target_month || Math.round((p.new_target || 0) / 12),
      total_amount: p.total_amount || 0,
      months_in_2026: p.months_in_2026 || 0,
      amount_in_2026: p.amount_in_2026 || 0
    },
    tpo_type: tpo,
    remark: p.remark || '',
    payments: [],
    total_oo_budget: 0,
    total_paid_actual: 0,
    disbursed_rate: 0
  };
});

// 2. Clean Payments & calculate Aging
const payments = raw.payments.map((pay, idx) => {
  const schedD = pay.schedule_date ? new Date(pay.schedule_date) : null;
  const actualD = pay.actual_date ? new Date(pay.actual_date) : null;
  let agingDays = 0;
  let status = pay.oo_status;
  
  if (schedD && !isNaN(schedD)) {
    if (actualD && !isNaN(actualD)) {
      agingDays = Math.round((actualD - schedD) / (1000 * 60 * 60 * 24));
    } else {
      const now = new Date();
      agingDays = Math.round((now - schedD) / (1000 * 60 * 60 * 24));
      status = agingDays > 0 ? 'OVERDUE' : 'PENDING';
    }
  }
  
  let agingCategory = 'ON_TIME';
  if (status === 'OVERDUE' || (status === 'PAID' && agingDays > 15)) {
    agingCategory = 'SEVERE_DELAY';
  } else if (status === 'PAID' && agingDays > 0) {
    agingCategory = 'MILD_DELAY';
  } else if (status !== 'PAID') {
    agingCategory = 'PENDING';
  }
  
  const schedStr = schedD && !isNaN(schedD) ? schedD.toISOString().split('T')[0] : (pay.schedule_date || 'N/A');
  const actualStr = actualD && !isNaN(actualD) ? actualD.toISOString().split('T')[0] : (pay.actual_date || 'Chưa chi');
  
  return {
    payment_id: `PAY-${idx + 1}`,
    oaf_number: pay.oaf_number || 'N/A',
    contract_no: pay.contract_no || 'N/A',
    subd_id: String(pay.outlet_id).trim(),
    customer_name: String(pay.customer_name).trim(),
    area: pay.area || 'South 9',
    ss_name: pay.ss_name || 'Chưa gán SS',
    brand: pay.brand_id || 'Tiger',
    target_vol: pay.target_vol || 0,
    oo_amount: pay.oo_amount || 0,
    actual_amount: pay.actual_amount || 0,
    disbursed_pct: pay.oo_amount > 0 ? Math.round((pay.actual_amount / pay.oo_amount) * 1000) / 10 : 0,
    status: status,
    schedule_date: schedStr,
    actual_date: actualStr,
    aging_days: agingDays,
    aging_category: agingCategory,
    payment_notes: pay.payment_notes || ''
  };
});

// 3. Connect payments to SubDs
const planMap = {};
subdPlans.forEach(p => { planMap[p.subd_id] = p; });

payments.forEach(pay => {
  if (planMap[pay.subd_id]) {
    planMap[pay.subd_id].payments.push(pay);
    planMap[pay.subd_id].total_oo_budget += pay.oo_amount;
    planMap[pay.subd_id].total_paid_actual += pay.actual_amount;
  }
});

subdPlans.forEach(p => {
  if (p.total_oo_budget > 0) {
    p.disbursed_rate = Math.round((p.total_paid_actual / p.total_oo_budget) * 1000) / 10;
  }
});

// 4. Summarize Aggregates
let totalPlanTargetVol = 0;
let totalPlanContractAmt = 0;
let totalPlan2026Amt = 0;
let totalPlan2026Target = 0;

let tpoStats = {
  TPO: { count: 0, target_month: 0, target_annual: 0, amount_2026: 0, total_amount: 0 },
  'Non TPO': { count: 0, target_month: 0, target_annual: 0, amount_2026: 0, total_amount: 0 },
  'TPO Abnormal': { count: 0, target_month: 0, target_annual: 0, amount_2026: 0, total_amount: 0 }
};

subdPlans.forEach(p => {
  totalPlanTargetVol += p.new_plan.target_vol;
  totalPlanContractAmt += p.new_plan.total_amount;
  totalPlan2026Amt += p.new_plan.amount_in_2026;
  totalPlan2026Target += p.new_plan.target_month * p.new_plan.months_in_2026;
  
  const cat = tpoStats[p.tpo_type] ? p.tpo_type : 'TPO';
  tpoStats[cat].count++;
  tpoStats[cat].target_month += p.new_plan.target_month;
  tpoStats[cat].target_annual += p.new_plan.target_vol;
  tpoStats[cat].amount_2026 += p.new_plan.amount_in_2026;
  tpoStats[cat].total_amount += p.new_plan.total_amount;
});

// Payment aggregates
let totalOOBudget = 0;
let totalActualPaid = 0;
let agingStats = {
  ON_TIME: 0,
  MILD_DELAY: 0,
  SEVERE_DELAY: 0,
  PENDING: 0
};
let ssStats = {};

payments.forEach(pay => {
  totalOOBudget += pay.oo_amount;
  totalActualPaid += pay.actual_amount;
  agingStats[pay.aging_category] = (agingStats[pay.aging_category] || 0) + 1;
  
  if (!ssStats[pay.ss_name]) {
    ssStats[pay.ss_name] = {
      ss_name: pay.ss_name,
      area: pay.area,
      count: 0,
      oo_budget: 0,
      actual_paid: 0,
      severe_delays: 0
    };
  }
  ssStats[pay.ss_name].count++;
  ssStats[pay.ss_name].oo_budget += pay.oo_amount;
  ssStats[pay.ss_name].actual_paid += pay.actual_amount;
  if (pay.aging_category === 'SEVERE_DELAY') ssStats[pay.ss_name].severe_delays++;
});

const dataMart = {
  meta: {
    project_name: "HEINEKEN TIE-UP TARGET & PAYMENT TRACKING",
    version: "2.0.0",
    generated_at: new Date().toISOString(),
    author: "AI4A Master Orchestrator",
    zero_discrepancy_check: {
      plan_subds_count: subdPlans.length,
      plan_2026_budget_vnđ: totalPlan2026Amt,
      plan_total_annual_target: totalPlanTargetVol,
      payment_records_count: payments.length,
      total_oo_budget_vnđ: totalOOBudget,
      total_actual_paid_vnđ: totalActualPaid,
      overall_disbursed_rate_pct: Math.round((totalActualPaid / totalOOBudget) * 1000) / 10
    }
  },
  kpis: {
    total_subds: subdPlans.length,
    total_annual_target: totalPlanTargetVol,
    total_2026_budget: totalPlan2026Amt,
    total_contract_value: totalPlanContractAmt,
    total_oo_budget: totalOOBudget,
    total_actual_paid: totalActualPaid,
    overall_disbursed_pct: Math.round((totalActualPaid / totalOOBudget) * 1000) / 10,
    aging_summary: agingStats
  },
  tpo_summary: tpoStats,
  ss_summary: Object.values(ssStats),
  subd_plans: subdPlans,
  payments: payments
};

const targetFile = path.join(dataMartDir, 'tracking_data_mart.json');
fs.writeFileSync(targetFile, JSON.stringify(dataMart, null, 2), 'utf8');

console.log('Successfully generated Data Mart in 01_Data_Mart!');
console.log('Target file:', targetFile);
console.log('SubDs count:', subdPlans.length);
console.log('Payments count:', payments.length);
console.log('Plan 2026 Budget:', totalPlan2026Amt.toLocaleString(), 'VNĐ');
console.log('Disbursed Actual:', totalActualPaid.toLocaleString(), 'VNĐ (Rate:', dataMart.kpis.overall_disbursed_pct + '%)');
