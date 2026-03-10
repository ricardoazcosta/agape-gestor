import { Inject, Injectable } from '@nestjs/common'
import { TransactionType } from '@prisma/client'
import { Transaction } from '../domain/transaction.entity'
import {
  ITransactionRepository,
  TRANSACTION_REPOSITORY,
} from '../domain/transaction.repository.interface'
import { randomUUID } from 'crypto'

/**
 * DTO para criação de transação
 */
export interface CreateTransactionDto {
  type: TransactionType
  categoryId: string
  amount: number
  description: string
  date?: Date
  donorName?: string
  receiptUrl?: string
  createdById: string
}

/**
 * Use Case: Criar Transação (Application Layer)
 * Orquestra a lógica de negócio para criar uma transação
 * Não conhece detalhes de infraestrutura (Prisma, HTTP, etc)
 */
@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTION_REPOSITORY)
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    // Validações de negócio
    this.validateBusinessRules(dto)

    // Cria a entidade de domínio
    const transaction = Transaction.create({
      id: randomUUID(),
      type: dto.type,
      categoryId: dto.categoryId,
      amount: dto.amount,
      description: dto.description,
      date: dto.date || new Date(),
      donorName: dto.donorName,
      receiptUrl: dto.receiptUrl,
      createdById: dto.createdById,
    })

    // Persiste via repositório
    return await this.transactionRepository.create(transaction)
  }

  private validateBusinessRules(dto: CreateTransactionDto): void {
    // Regra de negócio: Dízimo nominal deve ter nome do dizimista
    if (dto.type === TransactionType.INCOME && dto.donorName) {
      if (dto.donorName.length < 3) {
        throw new Error('Donor name must have at least 3 characters')
      }
    }

    // Regra de negócio: Valores acima de R$ 10.000 requerem comprovante
    if (dto.amount > 10000 && !dto.receiptUrl) {
      throw new Error('Transactions above R$ 10,000 require receipt')
    }
  }
}
