import { AppError } from '../../shared/errors/app-error.js';
import { QuestionErrors } from './question.errors.js';

export class QuestionService {
  constructor(repository) {
    this.repository = repository;
  }

  async createQuestion(data) {
    if (!data.question_category_id) {
      throw new AppError(QuestionErrors.CATEGORY_REQUIRED, 400);
    }
    const questionId = await this.repository.create(data);
    return { id: questionId, message: 'Questão criada com sucesso!' };
  }

  async getAllQuestions() {
    return await this.repository.findAll();
  }

  async deleteQuestion(id) {
    const questionExists = await this.repository.findById(id);
    if (!questionExists) {
      throw new AppError(QuestionErrors.NOT_FOUND, 404);
    }

    // Regra de Negócio: Não pode deletar questão que já foi respondida
    const hasInteractions = await this.repository.hasInteractions(id);
    if (hasInteractions) {
      throw new AppError(QuestionErrors.CANNOT_DELETE_WITH_INTERACTIONS, 403);
    }

    await this.repository.delete(id);
  }
}