import { Injectable } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '@core/database/prisma.service'
import { IUserRepository } from '../domain/user.repository.interface'
import { User } from '../domain/user.entity'

/**
 * Implementação do UserRepository usando Prisma (Infrastructure Layer)
 */
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user ? this.toDomain(user) : null
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    return user ? this.toDomain(user) : null
  }

  async create(data: {
    id: string
    name: string
    email: string
    password: string
  }): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        role: UserRole.VIEWER,
      },
    })
    return this.toDomain(user)
  }

  private toDomain(prismaUser: any): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.role,
      prismaUser.active,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    )
  }
}
