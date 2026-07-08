// @file: src/features/user/user.routes.js
import pool from '../../database/pool.js'
import { UserRepository } from './user.repository.js'
import { UserService } from './user.service.js'
import { UserController } from './user.controller.js'
import { errorResponseSchema } from '../../shared/http/schemas.js'

const userResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    email: { type: 'string' },
    username: { type: 'string' },
  },
}

export default async function userRoutes(server) {
  // Montagem da injeção de dependência acontece aqui, não dentro das classes
  const repository = new UserRepository(pool)
  const service = new UserService(repository)
  const controller = new UserController(service)

  server.get('/users', {
    schema: {
      tags: ['Users'],
      summary: 'Lista todos os usuários',
      response: {
        200: { type: 'array', items: userResponseSchema },
      },
    },
    handler: controller.list.bind(controller),
  })

  server.get('/users/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Busca um usuário por ID',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
      response: {
        200: userResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: controller.getById.bind(controller),
  })

  server.post('/users', {
    schema: {
      tags: ['Users'],
      summary: 'Cria um novo usuário',
      body: {
        type: 'object',
        required: ['email', 'password', 'username'],
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          username: { type: 'string' },
        },
      },
      response: {
        201: userResponseSchema,
        400: errorResponseSchema,
        422: errorResponseSchema,
      },
    },
    handler: controller.create.bind(controller),
  })

  server.patch('/users/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Atualiza um usuário',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          username: { type: 'string' },
        },
      },
      response: {
        200: userResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: controller.update.bind(controller),
  })

  server.delete('/users/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Remove um usuário',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
      response: {
        204: { type: 'null' },
        404: errorResponseSchema,
      },
    },
    handler: controller.remove.bind(controller),
  })
}