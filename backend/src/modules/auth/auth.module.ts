import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthController } from './presentation/auth.controller'
import { LoginUseCase } from './application/login.use-case'
import { UserRepository } from './infrastructure/user.repository'
import { USER_REPOSITORY } from './domain/user.repository.interface'

/**
 * AuthModule (TASK-04)
 * Módulo de autenticação JWT com DDD
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN', '24h') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
