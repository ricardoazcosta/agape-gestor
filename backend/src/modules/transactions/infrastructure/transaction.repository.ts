import { Injectable } from '@nestjs/common'
import { TransactionType } from '@prisma/client'
import { PrismaService } from '@core/database/prisma.service'
import { ITransactionRepository } from '../domain/transaction.repository.interface'
import { Transaction } from '../domain/transaction.entity'

/**
 * Implementação do Repositório usando Prisma (Infrastructure Layer)
 * Conhece detalhes de infraestrutura (Prisma, banco de dados)
 */
@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const created = await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        type: transaction.type,
        categoryId: transaction.categoryId,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
        donorName: transaction.donorName,
        receiptUrl: transaction.receiptUrl,
        createdById: transaction.createdById,
      },
      include: {
        category: true,
        createdBy: true,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: true,
      },
    })

    return transaction ? this.toDomain(transaction) : null
  }

  async findAll(filters?: {
    type?: TransactionType
    startDate?: Date
    endDate?: Date
    createdById?: string
  }): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        type: filters?.type,
        date: {
          gte: filters?.startDate,
          lte: filters?.endDate,
        },
        createdById: filters?.createdById,
      },
      include: {
        category: true,
        createdBy: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    return transactions.map((t) => this.toDomain(t))
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const updated = await this.prisma.transaction.update({
      where: { id },
      data: {
        type: data.type,
        categoryId: data.categoryId,
        amount: data.amount ? Number(data.amount) : undefined,
        description: data.description,
        date: data.date,
        donorName: data.donorName,
        receiptUrl: data.receiptUrl,
      },
      include: {
        category: true,
        createdBy: true,
      },
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    // Soft delete: Não deletamos, apenas marcamos auditoria
    // Na prática, transações financeiras NUNCA devem ser deletadas
    // Apenas corrigidas com transações de estorno
    throw new Error('Transactions cannot be deleted for audit purposes. Use reversal transactions instead.')
  }

  async getTotalIncome(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        type: TransactionType.INCOME,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    })

    return Number(result._sum.amount) || 0
  }

  async getTotalExpense(startDate: Date, endDate: Date): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      where: {
        type: TransactionType.EXPENSE,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    })

    return Number(result._sum.amount) || 0
  }

  async getBalance(startDate: Date, endDate: Date): Promise<number> {
    const [income, expense] = await Promise.all([
      this.getTotalIncome(startDate, endDate),
      this.getTotalExpense(startDate, endDate),
    ])

    return income - expense
  }

  /**
   * Mapper: Prisma model -> Domain Entity
   */
  private toDomain(prismaTransaction: any): Transaction {
    return new Transaction(
      prismaTransaction.id,
      prismaTransaction.type,
      prismaTransaction.categoryId,
      Number(prismaTransaction.amount),
      prismaTransaction.description,
      prismaTransaction.date,
      prismaTransaction.donorName,
      prismaTransaction.receiptUrl,
      prismaTransaction.createdById,
      prismaTransaction.createdAt,
      prismaTransaction.updatedAt,
    )
  }
}
