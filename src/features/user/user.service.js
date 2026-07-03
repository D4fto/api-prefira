// @file: src/features/user/user.service.js
import bcrypt from 'bcryptjs'
import {
  UserNotFoundError,
  UserEmailAlreadyExistsError,
  UserUsernameAlreadyExistsError,
  UserValidationError,
} from './user.errors.js'

export class UserService {
  constructor(repository) {
    this.repository = repository
  }

  async listUsers() {
    return this.repository.findAll()
  }

  async getUserById(id) {
    const user = await this.repository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  }

  async createUser({ email, password, username }) {
    if (!email || email.trim() === '') {
      throw new UserValidationError('O e-mail é obrigatório.')
    }

    if (!username || username.trim() === '') {
      throw new UserValidationError('O nome de usuário é obrigatório.')
    }

    if (!password || password.length < 6) {
      throw new UserValidationError('A senha deve ter ao menos 6 caracteres.')
    }

    const existingEmail = await this.repository.findByEmail(email)
    // Regra de negócio 1: não é possível cadastrar e-mail duplicado
    if (existingEmail) {
      throw new UserEmailAlreadyExistsError()
    }

    const existingUsername = await this.repository.findByUsername(username)
    // Regra de negócio 2: não é possível cadastrar username duplicado
    if (existingUsername) {
      throw new UserUsernameAlreadyExistsError()
    }

    const passwordHash = await bcrypt.hash(password, 10)

    return this.repository.create({ email, passwordHash, username })
  }

  async updateUser(id, { email, username }) {
    const user = await this.getUserById(id) // lança 404 se não existir

    if (email && email !== user.email) {
      const existingEmail = await this.repository.findByEmail(email)
      if (existingEmail && existingEmail.id !== user.id) {
        throw new UserEmailAlreadyExistsError()
      }
    }

    if (username && username !== user.username) {
      const existingUsername = await this.repository.findByUsername(username)
      if (existingUsername && existingUsername.id !== user.id) {
        throw new UserUsernameAlreadyExistsError()
      }
    }

    return this.repository.update(id, { email, username })
  }

  async deleteUser(id) {
    await this.getUserById(id) // garante existência, senão lança 404
    return this.repository.delete(id)
  }
}