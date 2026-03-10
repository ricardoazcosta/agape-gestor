import { TransactionType } from '@prisma/client'

/**
 * Transaction Entity (Domain Layer)
 * Representa uma transação financeira no domínio
 * Contém regras de negócio e validações
 */
export class Transaction {
  constructor(
    public readonly id: string,
    public readonly type: TransactionType,
    public readonly categoryId: string,
    public readonly amount: number,
    public readonly description: string,
    public readonly date: Date,
    public readonly donorName: string | null,
    public readonly receiptUrl: string | null,
    public readonly createdById: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate()
  }

  /**
   * Validações de domínio
   */
  private validate(): void {
    if (this.amount <= 0) {
      throw new Error('Amount must be greater than zero')
    }

    if (this.description.length < 3) {
      throw new Error('Description must have at least 3 characters')
    }

    if (this.date > new Date()) {
      throw new Error('Transaction date cannot be in the future')
    }
  }

  /**
   * Factory method para criar transação
   */
  static create(props: {
    id: string
    type: TransactionType
    categoryId: string
    amount: number
    description: string
    date: Date
    donorName?: string
    receiptUrl?: string
    createdById: string
  }): Transaction {
    return new Transaction(
      props.id,
      props.type,
      props.categoryId,
      props.amount,
      props.description,
      props.date,
      props.donorName || null,
      props.receiptUrl || null,
      props.createdById,
      new Date(),
      new Date(),
    )
  }

  /**
   * Verifica se é uma entrada (dízimo/oferta)
   */
  isIncome(): boolean {
    return this.type === TransactionType.INCOME
  }

  /**
   * Verifica se é uma saída (despesa)
   */
  isExpense(): boolean {
    return this.type === TransactionType.EXPENSE
  }

  /**
   * Formata o valor para display
   */
  getFormattedAmount(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(this.amount)
  }
}
