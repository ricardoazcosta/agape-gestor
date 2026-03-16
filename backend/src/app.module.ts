import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@core/database/database.module'
import { AuthModule } from '@modules/auth/auth.module'
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard'
import { TransactionsModule } from '@modules/transactions/transactions.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    TransactionsModule,
  ],
  providers: [
    // JwtAuthGuard aplicado globalmente em todas as rotas (TASK-16)
    // Rotas abertas devem usar o decorator @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
