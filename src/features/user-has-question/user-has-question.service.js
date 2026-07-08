// @file: src/features/user-has-question/user-has-question.service.js
import {
  AlreadyAnsweredError,
  QuestionInteractionNotFoundError,
} from './user-has-question.errors.js';

export class UserHasQuestionService {
  constructor(repository) {
    this.repository = repository;
  }

  async listInteractions() {
    return await this.repository.findAll();
  }



  async registerInteraction(userId, data) {
    const { question_id, option, review } = data;

    // Regra de Negócio: Verifica se a questão existe
    const questionExists = await this.repository.checkQuestionExists(question_id);
    if (!questionExists) {
      throw new QuestionInteractionNotFoundError();
    }

    // Regra de Negócio: Impede que um usuário responda a mesma questão duas vezes
    const alreadyAnswered = await this.repository.checkIfExists(userId, question_id);
    if (alreadyAnswered) {
      throw new AlreadyAnsweredError();
    }

    await this.repository.create(userId, question_id, option, review);
    return { message: 'Interação registrada com sucesso.' };
  }

  async updateInteraction(userId, questionId, data) {
    const { option, review } = data;

    const updated = await this.repository.update(userId, questionId, { option, review });

    // Regra de Negócio: só é possível editar uma interação que já existe
    if (!updated) {
      throw new QuestionInteractionNotFoundError();
    }

    return updated;
  }

  async removeInteraction(userId, questionId) {
    const deleted = await this.repository.delete(userId, questionId);

    // Regra de Negócio: só é possível remover uma interação que já existe
    if (!deleted) {
      throw new QuestionInteractionNotFoundError();
    }
  }
}