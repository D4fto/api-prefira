// @file: src/features/user-has-question/user-has-question.routes.js
import { UserHasQuestionRepository } from './user-has-question.repository.js';
import { UserHasQuestionService } from './user-has-question.service.js';
import { UserHasQuestionController } from './user-has-question.controller.js';
import pool from '../../database/pool.js';
import { authGuard } from '../../shared/http/auth-guard.js';

export default async function userHasQuestionRoutes(server) {
  const repository = new UserHasQuestionRepository(pool);
  const service = new UserHasQuestionService(repository);
  const controller = new UserHasQuestionController(service);

  const createSchema = {
    schema: {
      tags: ['Interactions'],
      summary: 'Registra a resposta do usuário para uma questão',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['question_id', 'option', 'review'],
        properties: {
          question_id: { type: 'integer' },
          option: { type: 'integer' },
          review: { type: 'boolean' }
        }
      }
    },
    preHandler: authGuard
  };

  // Caminho atualizado para incluir /interactions
  server.post('/interactions', createSchema, controller.create.bind(controller));
}