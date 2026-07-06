// @file: src/features/question/question.repository.js
export class QuestionRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(data) {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const questionQuery = `
        INSERT INTO question (option1, option1_choices, option2, option2_choices, question_category_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;
      const questionValues = [
        data.option1,
        data.option1_choices,
        data.option2,
        data.option2_choices,
        data.question_category_id
      ];
      
      const result = await client.query(questionQuery, questionValues);
      const questionId = result.rows[0].id;

      const statsQuery = `
        INSERT INTO question_statistics (question_id)
        OVERRIDING SYSTEM VALUE
        VALUES ($1)
      `;
      await client.query(statsQuery, [questionId]);

      await client.query('COMMIT');
      return questionId;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll() {
    const query = `
      SELECT 
        q.id, q.option1, q.option1_choices, q.option2, q.option2_choices,
        c.name as category_name,
        s.likes, s.dislikes, s.views
      FROM question q
      LEFT JOIN question_category c ON q.question_category_id = c.id
      LEFT JOIN question_statistics s ON q.id = s.question_id
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = 'SELECT * FROM question WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async hasInteractions(id) {
    const query = 'SELECT 1 FROM user_has_question WHERE question_id = $1 LIMIT 1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  async delete(id) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN'); // Inicia a transação

      // 1. Deleta a tabela filha primeiro (estatísticas) para evitar erro de Foreign Key
      const deleteStatsQuery = 'DELETE FROM question_statistics WHERE question_id = $1';
      await client.query(deleteStatsQuery, [id]);

      // 2. Agora pode deletar a tabela pai (questão) com segurança
      const deleteQuestionQuery = 'DELETE FROM question WHERE id = $1';
      await client.query(deleteQuestionQuery, [id]);

      await client.query('COMMIT'); // Salva as alterações
    } catch (error) {
      await client.query('ROLLBACK'); // Desfaz se algo der errado
      throw error;
    } finally {
      client.release(); // Libera a conexão
    }
  }
}