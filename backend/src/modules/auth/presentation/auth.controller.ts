import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { LoginUseCase } from '../application/login.use-case'
import { LoginDto } from './dtos/login.dto'
import { Public } from '../decorators/public.decorator'

/**
 * AuthController (TASK-05)
 * Rotas públicas de autenticação
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    })

    return {
      success: true,
      data: result,
      message: 'Login successful',
    }
  }
}
