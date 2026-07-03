// @file: src/features/auth/auth.routes.js
import pool from '../../database/pool.js'
import { UserRepository } from '../user/user.repository.js'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'

export default async function authRoutes(server) {
  const userRepository = new UserRepository(pool)
  const service = new AuthService(userRepository)
  const controller = new AuthController(service)

  server.post('/login', controller.login.bind(controller))
}