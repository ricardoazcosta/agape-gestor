import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

/**
 * @Public() (TASK-17)
 * Marca uma rota como pública — ignora o JwtAuthGuard global.
 * Uso: @Public() antes de @Get() ou @Post()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
