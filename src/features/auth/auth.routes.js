// @file: src/features/auth/auth.routes.js
import pool from '../../database/pool.js'
import { UserRepository } from '../user/user.repository.js'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'
import { errorResponseSchema } from '../../shared/http/schemas.js'

export default async function authRoutes(server) {
  const userRepository = new UserRepository(pool)
  const service = new AuthService(userRepository)
  const controller = new AuthController(service)

  server.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Autentica um usuário e retorna um token JWT',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                email: { type: 'string' },
                username: { type: 'string' },
              },
            },
          },
        },
        401: errorResponseSchema,
      },
    },
    handler: controller.login.bind(controller),
  })
}