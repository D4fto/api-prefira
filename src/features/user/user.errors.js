import { AppError } from '../../shared/errors/app-error.js'

export class UserNotFoundError extends AppError {
  constructor() {
    super('Usuário não encontrado.', 404)
  }
}

export class UserEmailAlreadyExistsError extends AppError {
  constructor() {
    super('Já existe um usuário cadastrado com esse e-mail.', 400)
  }
}

export class UserUsernameAlreadyExistsError extends AppError {
  constructor() {
    super('Esse nome de usuário já está em uso.', 400)
  }
}

export class UserValidationError extends AppError {
  constructor(message) {
    super(message, 422)
  }
}