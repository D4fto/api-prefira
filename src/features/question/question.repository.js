export class QuestionRepository {
  constructor(pool) {
    this.pool = pool;
  }

  async create(data) {
    const client = await this.pool.connect();
    try {
      // Usamos transaction porque vamos inserir em duas tabelas (1:1)
      await client.query('BEGIN');
      
      const insertQuestionQuery = `
        INSERT INTO question (option1, option1_choices, option2, option2_choices, question_category_id)
        VALUES ($1, $2, $3, $4, $5) RETURNING id
      `;
      const questionValues = [data.option1, data.option1_choices, data.option2, data.option2_choices, data.question_category_id];
      const result = await client.query(insertQuestionQuery, questionValues);
      const newQuestionId = result.rows[0].id;

      // Cria a estatística zerada atrelada à questão (1:1)
      const insertStatsQuery = `
        INSERT INTO question_statistics (question_id, likes, dislikes, views)
        VALUES ($1, 0, 0, 0)
      `;
      await client.query(insertStatsQuery, [newQuestionId]);

      await client.query('COMMIT');
      return newQuestionId;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAll() {
    // INNER JOIN para trazer os dados enriquecidos da Categoria e Estatísticas
    const query = `
      SELECT 
        q.id, q.option1, q.option2, 
        c.name as category_name,
        s.likes, s.dislikes, s.views
      FROM question q
      INNER JOIN question_category c ON q.question_category_id = c.id
      INNER JOIN question_statistics s ON q.id = s.question_id
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findById(id) {
    const query = `SELECT * FROM question WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async hasInteractions(id) {
    const query = `SELECT 1 FROM user_has_question WHERE question_id = $1 LIMIT 1`;
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  async delete(id) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM question_statistics WHERE question_id = $1', [id]);
      await client.query('DELETE FROM question WHERE id = $1', [id]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}