import { Test, TestingModule } from '@nestjs/testing'
import { CreateTransactionUseCase } from './create-transaction.use-case'
import { ITransactionRepository, TRANSACTION_REPOSITORY } from '../domain/transaction.repository.interface'
import { Transaction } from '../domain/transaction.entity'
import { TransactionType } from '@prisma/client'

/**
 * Mock do Repositório para testes unitários
 * Não toca no banco de dados real
 */
class MockTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = []

  async create(transaction: Transaction): Promise<Transaction> {
    this.transactions.push(transaction)
    return transaction
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.find(t => t.id === id) || null
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactions
  }

  async update(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const transaction = await this.findById(id)
    if (!transaction) throw new Error('Transaction not found')
    return Object.assign(transaction, data)
  }

  async delete(id: string): Promise<void> {
    this.transactions = this.transactions.filter(t => t.id !== id)
  }

  async getTotalIncome(startDate: Date, endDate: Date): Promise<number> {
    return 0
  }

  async getTotalExpense(startDate: Date, endDate: Date): Promise<number> {
    return 0
  }

  async getBalance(startDate: Date, endDate: Date): Promise<number> {
    return 0
  }
}

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase
  let repository: MockTransactionRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TRANSACTION_REPOSITORY,
          useClass: MockTransactionRepository,
        },
      ],
    }).compile()

    useCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase)
    repository = module.get<MockTransactionRepository>(TRANSACTION_REPOSITORY)
  })

  it('should be defined', () => {
    expect(useCase).toBeDefined()
  })

  describe('execute', () => {
    it('should create a valid income transaction', async () => {
      // Arrange
      const dto = {
        type: TransactionType.INCOME,
        categoryId: 'category-123',
        amount: 100.50,
        description: 'Dízimo da semana',
        date: new Date('2024-01-15'),
        donorName: 'João Silva',
        createdById: 'user-123',
      }

      // Act
      const result = await useCase.execute(dto)

      // Assert
      expect(result).toBeDefined()
      expect(result.type).toBe(TransactionType.INCOME)
      expect(result.amount).toBe(100.50)
      expect(result.description).toBe('Dízimo da semana')
      expect(result.donorName).toBe('João Silva')
      expect(result.isIncome()).toBe(true)
      expect(result.isExpense()).toBe(false)
    })

    it('should create a valid expense transaction', async () => {
      // Arrange
      const dto = {
        type: TransactionType.EXPENSE,
        categoryId: 'category-456',
        amount: 500.00,
        description: 'Conta de luz',
        date: new Date('2024-01-15'),
        createdById: 'user-123',
      }

      // Act
      const result = await useCase.execute(dto)

      // Assert
      expect(result).toBeDefined()
      expect(result.type).toBe(TransactionType.EXPENSE)
      expect(result.amount).toBe(500.00)
      expect(result.isExpense()).toBe(true)
      expect(result.isIncome()).toBe(false)
    })

    it('should throw error when donor name is too short', async () => {
      // Arrange
      const dto = {
        type: TransactionType.INCOME,
        categoryId: 'category-123',
        amount: 100,
        description: 'Dízimo',
        donorName: 'AB', // Nome muito curto
        createdById: 'user-123',
      }

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Donor name must have at least 3 characters',
      )
    })

    it('should throw error when amount above 10k without receipt', async () => {
      // Arrange
      const dto = {
        type: TransactionType.INCOME,
        categoryId: 'category-123',
        amount: 15000, // Acima de R$ 10.000
        description: 'Grande doação',
        createdById: 'user-123',
        // receiptUrl: undefined - Sem comprovante
      }

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Transactions above R$ 10,000 require receipt',
      )
    })

    it('should allow amount above 10k with receipt', async () => {
      // Arrange
      const dto = {
        type: TransactionType.INCOME,
        categoryId: 'category-123',
        amount: 15000,
        description: 'Grande doação',
        receiptUrl: 'https://storage.example.com/receipt-123.pdf',
        createdById: 'user-123',
      }

      // Act
      const result = await useCase.execute(dto)

      // Assert
      expect(result).toBeDefined()
      expect(result.amount).toBe(15000)
      expect(result.receiptUrl).toBe('https://storage.example.com/receipt-123.pdf')
    })

    it('should throw error when amount is zero or negative', async () => {
      // Arrange
      const dto = {
        type: TransactionType.INCOME,
        categoryId: 'category-123',
        amount: 0, // Valor inválido
        description: 'Transação inválida',
        createdById: 'user-123',
      }

      // Act & Assert
      await expect(useCase.execute(dto)).rejects.toThrow(
        'Amount must be greater than zero',
      )
    })

    it('should use current date when date is not provided', async () => {
      // Arrange
      const dto = {
        type: TransactionType.INCOME,
        categoryId: 'category-123',
        amount: 100,
        description: 'Oferta',
        createdById: 'user-123',
        // date: undefined
      }

      // Act
      const result = await useCase.execute(dto)

      // Assert
      expect(result.date).toBeInstanceOf(Date)
      const now = new Date()
      expect(result.date.getDate()).toBe(now.getDate())
    })
  })
})
