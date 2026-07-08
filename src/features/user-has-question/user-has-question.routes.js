// @file: src/features/user-has-question/user-has-question.routes.js
import pool from '../../database/pool.js';
import { UserHasQuestionRepository } from './user-has-question.repository.js';
import { UserHasQuestionService } from './user-has-question.service.js';
import { UserHasQuestionController } from './user-has-question.controller.js';
import { authGuard } from '../../shared/http/auth-guard.js';
import { errorResponseSchema } from '../../shared/http/schemas.js';

const interactionResponseSchema = {
  type: 'object',
  properties: {
    option: { type: 'integer' },
    review: { type: 'boolean' },
  },
};

export default async function userHasQuestionRoutes(server) {
  const repository = new UserHasQuestionRepository(pool);
  const service = new UserHasQuestionService(repository);
  const controller = new UserHasQuestionController(service);

  server.get('/interactions', {
    schema: {
      tags: ['User Has Question'],
      summary: 'Lista todas as interações',
      response: {
        200: {
          type: 'array',
          items: interactionResponseSchema,
        },
      },
    },
    handler: controller.list.bind(controller),
  });

  // POST recebe question_id no body, pois é o usuário registrando uma nova resposta
  server.post('/interactions', {
    preHandler: authGuard,
    schema: {
      tags: ['User Has Question'],
      summary: 'Registra a resposta do usuário logado a uma pergunta',
      body: {
        type: 'object',
        required: ['question_id', 'option'],
        properties: {
          question_id: { type: 'integer' },
          option: { type: 'integer' },
          review: { type: 'boolean' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
        400: errorResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: controller.create.bind(controller),
  });

  // PATCH/DELETE endereçam uma interação existente pelo question_id na URL
  server.patch('/interactions/:questionId', {
    preHandler: authGuard,
    schema: {
      tags: ['User Has Question'],
      summary: 'Atualiza a resposta do usuário logado a uma pergunta',
      params: {
        type: 'object',
        properties: { questionId: { type: 'integer' } },
      },
      body: {
        type: 'object',
        properties: {
          option: { type: 'integer' },
          review: { type: 'boolean' },
        },
      },
      response: {
        200: interactionResponseSchema,
        404: errorResponseSchema,
      },
    },
    handler: controller.update.bind(controller),
  });

  server.delete('/interactions/:questionId', {
    preHandler: authGuard,
    schema: {
      tags: ['User Has Question'],
      summary: 'Remove a resposta do usuário logado a uma pergunta',
      params: {
        type: 'object',
        properties: { questionId: { type: 'integer' } },
      },
      response: {
        204: { type: 'null' },
        404: errorResponseSchema,
      },
    },
    handler: controller.remove.bind(controller),
  });
}