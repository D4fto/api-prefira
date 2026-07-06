import { QuestionRepository } from './question.repository.js';
import { QuestionService } from './question.service.js';
import { QuestionController } from './question.controller.js';
import pool from '../../database/pool.js';
import { authGuard } from '../../shared/http/auth-guard.js';

export default async function questionRoutes(server) {
  // Injeção de Dependência
  const repository = new QuestionRepository(pool);
  const service = new QuestionService(repository);
  const controller = new QuestionController(service);

  // Schema do Swagger para a rota POST
  const createSchema = {
    schema: {
      tags: ['Questions'],
      summary: 'Cria uma nova questão',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['option1', 'option2', 'question_category_id'],
        properties: {
          option1: { type: 'string' },
          option1_choices: { type: 'string' },
          option2: { type: 'string' },
          option2_choices: { type: 'string' },
          question_category_id: { type: 'integer' }
        }
      },
      response: {
        201: { type: 'object', properties: { id: { type: 'integer' }, message: { type: 'string' } } },
        400: { type: 'object', properties: { status: { type: 'string' }, message: { type: 'string' } } }
      }
    },
    preHandler: authGuard // Protege a rota
  };

  server.post('/', createSchema, controller.create.bind(controller));
  
  server.get('/', {
    schema: { tags: ['Questions'], summary: 'Lista todas as questões enriquecidas' }
  }, controller.findAll.bind(controller));

  server.delete('/:id', {
    schema: {
      tags: ['Questions'], summary: 'Deleta uma questão', security: [{ bearerAuth: [] }],
      params: { type: 'object', properties: { id: { type: 'integer' } } }
    },
    preHandler: authGuard
  }, controller.delete.bind(controller));
}