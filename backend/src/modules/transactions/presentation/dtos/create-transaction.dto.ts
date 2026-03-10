import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator'
import { TransactionType } from '@prisma/client'
import { Type } from 'class-transformer'

/**
 * DTO para criação de transação (Presentation Layer)
 * Valida dados vindos da requisição HTTP
 */
export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType

  @IsUUID()
  @IsNotEmpty()
  categoryId: string

  @IsNumber()
  @Min(0.01)
  amount: number

  @IsString()
  @MinLength(3)
  description: string

  @IsOptional()
  @Type(() => Date)
  date?: Date

  @IsOptional()
  @IsString()
  @MinLength(3)
  donorName?: string

  @IsOptional()
  @IsString()
  receiptUrl?: string
}
