// @file: src/features/user/user.routes.js
import pool from '../../database/pool.js'
import { UserRepository } from './user.repository.js'
import { UserService } from './user.service.js'
import { UserController } from './user.controller.js'

export default async function userRoutes(server) {

  const repository = new UserRepository(pool)
  const service = new UserService(repository)
  const controller = new UserController(service)

  server.get('/users', controller.list.bind(controller))

  server.get('/users/:id', controller.getById.bind(controller))

  server.post('/users', controller.create.bind(controller))

  server.patch('/users/:id', controller.update.bind(controller))

  server.delete('/users/:id', controller.remove.bind(controller))
}