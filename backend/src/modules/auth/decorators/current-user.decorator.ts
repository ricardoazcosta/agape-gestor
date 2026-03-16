import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface CurrentUserData {
  userId: string
  email: string
  role: string
}

/**
 * @CurrentUser() (TASK-18)
 * Extrai o usuário autenticado do request (injetado pelo JwtStrategy).
 * Uso: @CurrentUser() user: CurrentUserData
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
