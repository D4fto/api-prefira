import { AppError } from '../../shared/errors/app-error.js';
import { InteractionErrors } from './user-has-question.errors.js';

export class UserHasQuestionService {
  constructor(repository) {
    this.repository = repository;
  }

  async registerInteraction(userId, data) {
    const { question_id, option, review } = data;

    // Regra de Negócio: Verifica se a questão existe
    const questionExists = await this.repository.checkQuestionExists(question_id);
    if (!questionExists) {
      throw new AppError(InteractionErrors.QUESTION_NOT_FOUND, 404);
    }

    // Regra de Negócio: Impede que um usuário responda a mesma questão duas vezes
    const alreadyAnswered = await this.repository.checkIfExists(userId, question_id);
    if (alreadyAnswered) {
      throw new AppError(InteractionErrors.ALREADY_ANSWERED, 400);
    }

    await this.repository.create(userId, question_id, option, review);
    return { message: 'Interação registrada com sucesso.' };
  }
}