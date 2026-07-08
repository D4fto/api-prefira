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

  async findAll(){
    return (await this.pool.query('SELECT * FROM user_has_question')).rows;
  }

  async create(userId, questionId, option, review) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN'); // Inicia a transação

      // 1. Registra a interação do usuário com a questão
      const insertInteractionQuery = `
        INSERT INTO user_has_question (user_id, question_id, option, review)
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

  async findByUserAndQuestion(userId, questionId) {
    const query = `
      SELECT user_id, question_id, option, review
      FROM user_has_question
      WHERE user_id = $1 AND question_id = $2
    `;
    const result = await this.pool.query(query, [userId, questionId]);
    return result.rows[0] ?? null;
  }

  async update(userId, questionId, { option, review }) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const currentResult = await client.query(
        'SELECT option, review FROM user_has_question WHERE user_id = $1 AND question_id = $2 FOR UPDATE',
        [userId, questionId]
      );
      const current = currentResult.rows[0];

      if (!current) {
        await client.query('ROLLBACK');
        return null;
      }

      // 1. Atualiza a interação em si (mantém valor atual se não vier no body)
      const updateInteractionQuery = `
        UPDATE user_has_question
        SET option = COALESCE($1, option),
            review = COALESCE($2, review)
        WHERE user_id = $3 AND question_id = $4
        RETURNING option, review
      `;
      const updatedResult = await client.query(updateInteractionQuery, [
        option ?? null,
        review ?? null,
        userId,
        questionId,
      ]);
      const updated = updatedResult.rows[0];

      // 2. Só corrige likes/dislikes se o review realmente mudou de valor.
      // "views" não é alterado aqui: é a mesma interação, não uma nova visualização.
      if (updated.review !== current.review) {
        const adjustStatsQuery = `
          UPDATE question_statistics
          SET
            likes = likes
              + CASE WHEN $1::boolean = true THEN -1 ELSE 0 END
              + CASE WHEN $2::boolean = true THEN 1 ELSE 0 END,
            dislikes = dislikes
              + CASE WHEN $1::boolean = false THEN -1 ELSE 0 END
              + CASE WHEN $2::boolean = false THEN 1 ELSE 0 END
          WHERE question_id = $3
        `;
        await client.query(adjustStatsQuery, [current.review, updated.review, questionId]);
      }

      await client.query('COMMIT');
      return updated;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async delete(userId, questionId) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');

      const currentResult = await client.query(
        'SELECT review FROM user_has_question WHERE user_id = $1 AND question_id = $2 FOR UPDATE',
        [userId, questionId]
      );
      const current = currentResult.rows[0];

      if (!current) {
        await client.query('ROLLBACK');
        return false;
      }

      await client.query(
        'DELETE FROM user_has_question WHERE user_id = $1 AND question_id = $2',
        [userId, questionId]
      );

      // Desfaz a contribuição que essa interação deu nas estatísticas
      const revertStatsQuery = `
        UPDATE question_statistics
        SET
          views = views - 1,
          likes = likes + CASE WHEN $1::boolean = true THEN -1 ELSE 0 END,
          dislikes = dislikes + CASE WHEN $1::boolean = false THEN -1 ELSE 0 END
        WHERE question_id = $2
      `;
      await client.query(revertStatsQuery, [current.review, questionId]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}