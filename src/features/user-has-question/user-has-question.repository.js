export class UserHasQuestionRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async checkIfExists(userId, questionId) {
    const query = `SELECT 1 FROM user_has_question WHERE user_id = $1 AND question_id = $2 LIMIT 1`;
    const result = await this.pool.query(query, [userId, questionId]);
    return result.rowCount > 0;
  }

  async checkQuestionExists(questionId) {
    const result = await this.pool.query('SELECT 1 FROM question WHERE id = $1', [questionId]);
    return result.rowCount > 0;
  }

  async create(userId, questionId, option, review) {
    const query = `
      INSERT INTO user_has_question (user_id, question_id, option, review)
      VALUES ($1, $2, $3, $4)
    `;
    await this.pool.query(query, [userId, questionId, option, review]);
  }
}