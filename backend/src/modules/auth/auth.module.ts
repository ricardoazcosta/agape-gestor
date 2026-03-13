import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AuthController } from './presentation/auth.controller'
import { LoginUseCase } from './application/login.use-case'
import { UserRepository } from './infrastructure/user.repository'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { USER_REPOSITORY } from './domain/user.repository.interface'

/**
 * AuthModule (TASK-01)
 * Responsável por autenticação JWT.
 * Exporta JwtAuthGuard para ser registrado globalmente no AppModule.
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ??
          'agape-gestor-secret-change-in-production',
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
