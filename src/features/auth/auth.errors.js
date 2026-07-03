// @file: src/features/auth/auth.errors.js
import { AppError } from '../../shared/errors/app-error.js'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('E-mail ou senha inválidos.', 401)
  }
}