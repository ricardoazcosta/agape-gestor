import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { IUserRepository, USER_REPOSITORY } from '../domain/user.repository.interface'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  accessToken: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

/**
 * Use Case: Login (Application Layer)
 * Valida credenciais e retorna JWT
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    if (!user.active) {
      throw new UnauthorizedException('User account is disabled')
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password)
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = { sub: user.id, email: user.email, role: user.role }
    const accessToken = this.jwtService.sign(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}
