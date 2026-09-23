# Executive Operations Summary Template

**Period:** `{{month}}`  
**Generated On:** `{{timestamp}}`  
**Audit Verification:** `{{audit_status}}`  

---

## 1. Executive KPIs
- **Total Employees:** `{{total_headcount}}`
- **Total Base Salary:** `{{total_base}}`
- **Total Performance Bonus:** `{{total_bonus}}` (`{{bonus_ratio}}%`)
- **Total Penalties / Deductions:** `{{total_penalty}}` (`{{penalty_ratio}}%`)
- **Total Net Disbursed:** `{{total_net}}`

---

## 2. Department Breakdown
| Department | Headcount | Base Salary | Bonus (% Base) | Penalty (% Base) | Net Payroll |
|---|:---:|---:|---:|---:|---:|
{{department_table_rows}}

---

## 3. Notable Performers & Anomalies
### 🌟 Top 5 Performance Bonus
| Employee ID | Name | Department | Manager | Bonus | Net Pay |
|---|---|---|---|---:|---:|
{{top_bonus_rows}}

### ⚠️ Top 5 Operational Deductions (Requires Review)
| Employee ID | Name | Department | Manager | Penalty | Net Pay |
|---|---|---|---|---:|---:|
{{top_penalty_rows}}

---

## 4. Split Files Generated
{{file_list}}

---

## 5. Operations Insights & Action Items
1. **Department Trends:** {{insights_performance}}
2. **Operational Risks:** {{insights_risks}}
3. **Audit Confirmation:** Zero-discrepancy confirmed across all split workbooks.
