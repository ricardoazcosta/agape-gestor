// Tipos de usuário (RBAC)
export enum UserRole {
  ADMIN = 'ADMIN',
  TREASURER = 'TREASURER',
  COUNCIL = 'COUNCIL',
  PASTOR = 'PASTOR',
  VIEWER = 'VIEWER',
}

// Tipos de transação
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Categorias de entrada
export enum IncomeCategory {
  TITHE = 'TITHE',
  OFFERING = 'OFFERING',
  DONATION = 'DONATION',
  OTHER = 'OTHER',
}

// Categorias de saída
export enum ExpenseCategory {
  MAINTENANCE = 'MAINTENANCE',
  UTILITIES = 'UTILITIES',
  SALARY = 'SALARY',
  PREBEND = 'PREBEND',
  MISSION = 'MISSION',
  OTHER = 'OTHER',
}

// Interfaces principais
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  type: TransactionType
  category: IncomeCategory | ExpenseCategory
  amount: number
  description: string
  date: string
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: string
  entityId: string
  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
  user: User
  timestamp: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
  period: {
    start: string
    end: string
  }
}
