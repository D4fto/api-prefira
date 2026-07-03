// @file: src/features/auth/auth.service.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { InvalidCredentialsError } from './auth.errors.js'

export class AuthService {
  // Reaproveita o UserRepository que já existe — não precisamos duplicar acesso a dados
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async login({ email, password }) {
    const user = await this.userRepository.findByEmail(email)

    // Mesma mensagem tanto pra e-mail inexistente quanto pra senha errada,
    // pra não dar pista se o e-mail existe ou não na base
    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatches = await bcrypt.compare(password, user.password)

    if (!passwordMatches) {
      throw new InvalidCredentialsError()
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    }
  }
}