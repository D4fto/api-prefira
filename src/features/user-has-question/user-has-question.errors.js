// @file: src/features/user-has-question/user-has-question.errors.js
import { AppError } from '../../shared/errors/app-error.js';

export class AlreadyAnsweredError extends AppError {
  constructor() {
    super('O usuário já respondeu a esta questão.', 400);
  }
}

export class QuestionInteractionNotFoundError extends AppError {
  constructor() {
    super('Questão informada não existe.', 404);
  }
}