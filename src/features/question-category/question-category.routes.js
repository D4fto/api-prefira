// @file: src/features/question-category/question-category.routes.js
import pool from '../../database/pool.js'
import { QuestionCategoryRepository } from './question-category.repository.js'
import { QuestionCategoryService } from './question-category.service.js'
import { QuestionCategoryController } from './question-category.controller.js'
import { errorResponseSchema } from '../../shared/http/schemas.js'

const categoryResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
  },
}

export default async function questionCategoryRoutes(server) {
  // Montagem da injeção de dependência acontece aqui, não dentro das classes
  const repository = new QuestionCategoryRepository(pool)
  const service = new QuestionCategoryService(repository)
  const controller = new QuestionCategoryController(service)

  server.get('/question-categories', {
    schema: {
      tags: ['Question Categories'],
      summary: 'Lista todas as categorias de pergunta',
      response: {
        200: { type: 'array', items: categoryResponseSchema },
      },
    },
    handler: controller.list.bind(controller),
  })

  server.get('/question-categories/:id', {
    schema: {
      tags: ['Question Categories'],
      summary: 'Busca uma categoria por ID',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
      response: {
        200: categoryResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: controller.getById.bind(controller),
  })

  server.post('/question-categories', {
    schema: {
      tags: ['Question Categories'],
      summary: 'Cria uma nova categoria de pergunta',
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
        },
      },
      response: {
        201: categoryResponseSchema,
        400: errorResponseSchema,
        422: errorResponseSchema,
      },
    },
    handler: controller.create.bind(controller),
  })

  server.patch('/question-categories/:id', {
    schema: {
      tags: ['Question Categories'],
      summary: 'Atualiza uma categoria de pergunta',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      },
      response: {
        200: categoryResponseSchema,
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: controller.update.bind(controller),
  })

  server.delete('/question-categories/:id', {
    schema: {
      tags: ['Question Categories'],
      summary: 'Remove uma categoria de pergunta',
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } },
      },
      response: {
        204: { type: 'null' },
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: controller.remove.bind(controller),
  })
}