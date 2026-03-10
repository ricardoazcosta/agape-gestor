import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common'
import { CreateTransactionUseCase } from '../application/create-transaction.use-case'
import { CreateTransactionDto } from './dtos/create-transaction.dto'

/**
 * Controller de Transações (Presentation Layer)
 * Responsável por receber requisições HTTP e delegar para os Use Cases
 */
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateTransactionDto,
    @Request() req: any,
  ) {
    // O usuário autenticado vem do JWT (será implementado depois)
    const userId = req.user?.id || 'temp-user-id'

    const transaction = await this.createTransactionUseCase.execute({
      ...dto,
      createdById: userId,
    })

    return {
      success: true,
      data: transaction,
      message: 'Transaction created successfully',
    }
  }

  @Get()
  async findAll() {
    // TODO: Implementar GetTransactionsUseCase
    return {
      success: true,
      data: [],
      message: 'Transactions retrieved successfully',
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // TODO: Implementar GetTransactionByIdUseCase
    return {
      success: true,
      data: null,
      message: 'Transaction retrieved successfully',
    }
  }
}
