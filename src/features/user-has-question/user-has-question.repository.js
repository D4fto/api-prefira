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
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN'); // Inicia a transação

      // 1. Registra a interação do usuário com a questão
      const insertInteractionQuery = `
        INSERT INTO user_has_question (user_id, question_id, option, review)
        OVERRIDING SYSTEM VALUE
        VALUES ($1, $2, $3, $4)
      `;
      await client.query(insertInteractionQuery, [userId, questionId, option, review]);

      // 2. Atualiza a tabela de estatísticas
      // Regra aplicada: +1 view sempre. Se review for true = +1 like. Se review for false = +1 dislike.
      const updateStatsQuery = `
        UPDATE question_statistics 
        SET 
          views = views + 1,
          likes = likes + CASE WHEN $1::boolean = true THEN 1 ELSE 0 END,
          dislikes = dislikes + CASE WHEN $1::boolean = false THEN 1 ELSE 0 END
        WHERE question_id = $2
      `;
      await client.query(updateStatsQuery, [review, questionId]);

      await client.query('COMMIT'); // Salva tudo
    } catch (error) {
      await client.query('ROLLBACK'); // Desfaz se der erro
      throw error;
    } finally {
      client.release(); // Libera a conexão
    }
  }
}