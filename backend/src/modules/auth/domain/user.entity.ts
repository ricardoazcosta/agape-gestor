import { UserRole } from '@prisma/client'

/**
 * User Entity (Domain Layer)
 * Representa um usuário no domínio
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly active: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN
  }

  isTreasurer(): boolean {
    return this.role === UserRole.TREASURER
  }

  canWrite(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.TREASURER
  }
}
