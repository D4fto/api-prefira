// @file: src/features/question/question.errors.js
import { AppError } from '../../shared/errors/app-error.js';

export class QuestionNotFoundError extends AppError {
  constructor() {
    super('Questão não encontrada.', 404);
  }
}

export class CategoryRequiredError extends AppError {
  constructor() {
    super('A categoria da questão é obrigatória.', 400);
  }
}

export class CannotDeleteWithInteractionsError extends AppError {
  constructor() {
    super('Não é possível deletar uma questão que já possui respostas dos usuários.', 403);
  }
}