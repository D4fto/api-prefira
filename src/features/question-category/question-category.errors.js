// @file: src/features/question-category/question-category.errors.js
import { AppError } from '../../shared/errors/app-error.js'

export class QuestionCategoryNotFoundError extends AppError {
  constructor() {
    super('Categoria de pergunta não encontrada.', 404)
  }
}

export class QuestionCategoryInUseError extends AppError {
  constructor() {
    super('Não é possível remover uma categoria que possui perguntas vinculadas.', 400)
  }
}

export class QuestionCategoryValidationError extends AppError {
  constructor(message) {
    super(message, 422)
  }
}