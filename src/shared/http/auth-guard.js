// @file: src/shared/http/auth-guard.js
import jwt from 'jsonwebtoken'
import { AppError } from '../errors/app-error.js'

export function authGuard(request, reply, done) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token não informado.', 401)
  }

  const [, token] = authHeader.split(' ') // formato: "Bearer <token>"

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    request.user = payload // fica disponível como request.user.sub, request.user.username
    done()
  } catch {
    throw new AppError('Token inválido ou expirado.', 401)
  }
}

// Uso numa rota:
// server.get('/users/:id', { preHandler: authGuard }, controller.getById.bind(controller))