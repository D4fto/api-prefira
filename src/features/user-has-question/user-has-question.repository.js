// @file: src/features/user-has-question/user-has-question.repository.js
export class UserHasQuestionRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async checkQuestionExists(questionId) {
    const query = 'SELECT 1 FROM question WHERE id = $1 LIMIT 1';
    const result = await this.pool.query(query, [questionId]);
    return result.rowCount > 0;
  }

  async checkIfExists(userId, questionId) {
    const query = 'SELECT 1 FROM user_has_question WHERE user_id = $1 AND question_id = $2 LIMIT 1';
    const result = await this.pool.query(query, [userId, questionId]);
    return result.rowCount > 0;
  }

  async create(userId, questionId, option, review) {
    // Adicionamos o OVERRIDING SYSTEM VALUE para forçar o banco a aceitar os nossos IDs
    const query = `
      INSERT INTO user_has_question (user_id, question_id, option, review)
      OVERRIDING SYSTEM VALUE
      VALUES ($1, $2, $3, $4)
    `;
    await this.pool.query(query, [userId, questionId, option, review]);
  }
}