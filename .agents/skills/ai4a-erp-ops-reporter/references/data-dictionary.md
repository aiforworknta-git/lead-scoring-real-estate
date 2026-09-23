# ERP Operations Data Dictionary

> **Standard Schema for Monthly Operations & Payroll Exports**  
> **Course:** Agentic AI with Google Antigravity (AI4A)

---

## 1. Column Specifications

| Column Name | Data Type | Description | Validation Rule / Range |
|---|---|---|---|
| `Employee_ID` | String (Text) | Unique Identifier for employee | Pattern `E\d{3,4}` (e.g. `E001`, `E120`) |
| `Employee_Name` | String (Text) | Full name of employee | Non-empty string |
| `Manager` | String (Text) | Direct reporting manager | E.g. `Manager_A`, `Manager_B` |
| `Department` | String (Text) | Operating department | Standardized: `HR`, `Sales`, `Finance`, `Operations` |
| `Base_Salary` | Numeric (Integer/Float) | Fixed monthly base salary | Must be > 0 (in VND) |
| `Bonus` | Numeric (Integer/Float) | Performance bonus | Must be >= 0 (in VND) |
| `Penalty` | Numeric (Integer/Float) | Operational penalty / deduction | Must be >= 0 (in VND) |
| `Month` | String (Date / YYYY-MM) | Reporting period | E.g. `2026-03` |
| `Net_Salary` | Numeric (Calculated) | Net payable amount | Formula: `Base_Salary + Bonus - Penalty` |

---

## 2. Business Rules & Calculations

1. **Net Salary Formula:**
   $$\text{Net\_Salary} = \text{Base\_Salary} + \text{Bonus} - \text{Penalty}$$
2. **Department Isolation:**
   - Files created for individual managers/departments MUST NOT contain data from other departments.
3. **Audit Reconciliation:**
   - $\sum \text{Base}_{\text{split}} = \sum \text{Base}_{\text{raw}}$
   - $\sum \text{Bonus}_{\text{split}} = \sum \text{Bonus}_{\text{raw}}$
   - $\sum \text{Penalty}_{\text{split}} = \sum \text{Penalty}_{\text{raw}}$
   - $\sum \text{Net}_{\text{split}} = \sum \text{Net}_{\text{raw}}$
   - Any discrepancy $> 0$ must trigger an automated audit alert.
