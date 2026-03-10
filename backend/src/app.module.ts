import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@core/database/database.module'
import { TransactionsModule } from '@modules/transactions/transactions.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TransactionsModule,
  ],
})
export class AppModule {}
