# 💼 Expense Management System (Odoo)

> An automated and transparent solution to manage expense reimbursements, approval workflows, and multi-level authorization within organizations.

---

## 🧩 Problem Statement

Companies often struggle with *manual expense reimbursement processes* that are:

- Time-consuming ⏱  
- Error-prone ❌  
- Lacking transparency 🕵‍♂  

There is no simple way to:
- Define *approval flows* based on thresholds.  
- Manage *multi-level approvals*.  
- Support *flexible approval rules*.  

---

## 🚀 Core Features

### 🔐 Authentication & User Management
- On first login/signup:
  - A *new company* is auto-created (in the selected country’s currency).
  - An *Admin User* is automatically set up.

#### Admin Capabilities
- Create *Employees* & *Managers*.  
- Assign and change roles → Employee, Manager.  
- Define *manager relationships* for employees.  

---

### 🧾 Expense Submission (Employee Role)
Employees can:
- Submit expense claims — (Amount, Category, Description, Date, etc.)  
- View their expense history → (Approved / Rejected)  

---

## 🔁 Approval Workflow (Manager/Admin Role)

> 📝 *Note:* If the “IS MANAGER APPROVER” field is checked, expenses are *first approved by the employee’s manager*.

When *multiple approvers* are assigned, Admin can define the *approval sequence*:

*Example:*
1. Manager  
2. Finance  
3. Director  

Once the current approver acts, the request automatically moves to the *next approver*.

Managers can:
- View expenses waiting for approval.  
- Approve/Reject with comments.  

---

## ⚙ Conditional Approval Flow

Approval Rules Support:
- *Percentage Rule:* e.g., If 60% of approvers approve → Expense approved.  
- *Specific Approver Rule:* e.g., If CFO approves → Auto-approved.  
- *Hybrid Rule:* Combine both (e.g., 60% OR CFO approves).  

> 💡 Both Multiple Approvers and Conditional Flows can work together seamlessly.

---

## 👥 Roles & Permissions

| Role | Permissions |
|------|--------------|
| *Admin* | Create company (auto on signup), manage users, set roles, configure approval rules, view all expenses, override approvals. |
| *Manager* | Approve/Reject expenses, view team expenses, escalate as per rules. |
| *Employee* | Submit expenses, view own expenses, check approval status. |

---

## 🧠 Additional Features

### 🧾 OCR for Receipts (Auto-Read)
Employees can *scan receipts*, and the system automatically extracts:
- Amount  
- Date  
- Description  
- Expense Type  
- Restaurant Name (if applicable)  
- Expense Category  

> Powered by OCR — no manual entry required!

---

## 🌍 API References

*For Country and Currency:*
```bash
https://restcountries.com/v3.1/all?fields=name,currencies
