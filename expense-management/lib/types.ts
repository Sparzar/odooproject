export type Role = "ADMIN" | "MANAGER" | "EMPLOYEE"

export type User = {
  id: string
  email: string
  name?: string
  role: Role
  managerId?: string | null
  companyId?: string
}

export type Company = {
  id: string
  name: string
  countryCode: string
  currency: string // e.g. "USD"
}

export type ExpenseStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "IN_REVIEW"

export type Expense = {
  id: string
  userId: string
  amount: number
  currency: string
  category: string
  description?: string
  date: string // ISO string
  receiptUrl?: string
  status: ExpenseStatus
  createdAt: string
  updatedAt: string
  companyId?: string
}

export type ApprovalAction = "approve" | "reject"

export type ApprovalItem = {
  expenseId: string
  step: number
  approverId: string
  comment?: string
  createdAt: string
}

export type SequenceApprover = {
  role?: Role
  userId?: string
  label: string
}

export type PercentageRule = {
  type: "percentage"
  threshold: number // e.g. 60 means >=60% approvers must approve
}

export type SpecificApproverRule = {
  type: "specific"
  approverUserId: string
  label?: string
}

export type HybridRule = {
  type: "hybrid"
  percentage: number
  specificUserId: string
}

export type ApprovalRule = {
  id: string
  companyId: string
  name: string
  sequence?: SequenceApprover[]
  conditional?: PercentageRule | SpecificApproverRule | HybridRule
  managerMustApproveFirst?: boolean
  createdAt: string
}

export type AuthMe = {
  token: string | null
  user: User | null
  company?: Company | null
}
