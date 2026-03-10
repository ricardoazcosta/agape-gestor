import { Module } from '@nestjs/common'
import { TransactionsController } from './presentation/transactions.controller'
import { CreateTransactionUseCase } from './application/create-transaction.use-case'
import { TransactionRepository } from './infrastructure/transaction.repository'
import { TRANSACTION_REPOSITORY } from './domain/transaction.repository.interface'

/**
 * Módulo de Transações
 * Registra todos os providers e exporta o que é necessário
 */
@Module({
  controllers: [TransactionsController],
  providers: [
    CreateTransactionUseCase,
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
  ],
  exports: [TRANSACTION_REPOSITORY],
})
export class TransactionsModule {}
