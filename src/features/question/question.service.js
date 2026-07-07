// @file: src/features/question/question.service.js
import { 
  QuestionNotFoundError, 
  CategoryRequiredError, 
  CannotDeleteWithInteractionsError 
} from './question.errors.js';

export class QuestionService {
  constructor(repository) {
    this.repository = repository;
  }

  async createQuestion(data) {
    if (!data.question_category_id) {
      throw new CategoryRequiredError();
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
      throw new QuestionNotFoundError();
    }

    // Regra de Negócio: Não pode deletar questão que já foi respondida
    const hasInteractions = await this.repository.hasInteractions(id);
    if (hasInteractions) {
      throw new CannotDeleteWithInteractionsError();
    }

    await this.repository.delete(id);
  }
}