// @file: src/features/question-category/question-category.routes.js
import pool from '../../database/pool.js'
import { QuestionCategoryRepository } from './question-category.repository.js'
import { QuestionCategoryService } from './question-category.service.js'
import { QuestionCategoryController } from './question-category.controller.js'

export default async function questionCategoryRoutes(server) {
  // Montagem da injeção de dependência acontece aqui, não dentro das classes
  const repository = new QuestionCategoryRepository(pool)
  const service = new QuestionCategoryService(repository)
  const controller = new QuestionCategoryController(service)

  server.get('/question-categories', controller.list.bind(controller))

  server.get('/question-categories/:id', controller.getById.bind(controller))

  server.post('/question-categories', controller.create.bind(controller))

  server.patch('/question-categories/:id', controller.update.bind(controller))

  server.delete('/question-categories/:id', controller.remove.bind(controller))
}