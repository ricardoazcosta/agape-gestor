import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email address' })
  email: string

  @IsString()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string
}
