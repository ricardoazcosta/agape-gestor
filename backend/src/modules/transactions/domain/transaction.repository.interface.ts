import { Transaction } from './transaction.entity'
import { TransactionType } from '@prisma/client'

/**
 * Interface do Repositório (Domain Layer)
 * Define o contrato para persistência sem se preocupar com implementação
 * Seguindo o princípio de Inversão de Dependência (DIP)
 */
export interface ITransactionRepository {
  /**
   * Cria uma nova transação
   */
  create(transaction: Transaction): Promise<Transaction>

  /**
   * Busca transação por ID
   */
  findById(id: string): Promise<Transaction | null>

  /**
   * Busca todas as transações
   */
  findAll(filters?: {
    type?: TransactionType
    startDate?: Date
    endDate?: Date
    createdById?: string
  }): Promise<Transaction[]>

  /**
   * Atualiza uma transação
   */
  update(id: string, data: Partial<Transaction>): Promise<Transaction>

  /**
   * Deleta uma transação (soft delete)
   */
  delete(id: string): Promise<void>

  /**
   * Calcula total de entradas em um período
   */
  getTotalIncome(startDate: Date, endDate: Date): Promise<number>

  /**
   * Calcula total de saídas em um período
   */
  getTotalExpense(startDate: Date, endDate: Date): Promise<number>

  /**
   * Calcula saldo (entradas - saídas)
   */
  getBalance(startDate: Date, endDate: Date): Promise<number>
}

// Token para injeção de dependência
export const TRANSACTION_REPOSITORY = Symbol('ITransactionRepository')
