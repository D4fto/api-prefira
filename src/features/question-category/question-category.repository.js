// @file: src/features/question-category/question-category.repository.js
export class QuestionCategoryRepository {
  constructor(pool) {
    this.pool = pool
  }

  async findAll() {
    const result = await this.pool.query(
      'SELECT id, name FROM question_category ORDER BY id'
    )
    return result.rows
  }

  async findById(id) {
    const result = await this.pool.query(
      'SELECT id, name FROM question_category WHERE id = $1',
      [id]
    )
    return result.rows[0] ?? null
  }

  async findByName(name) {
    const result = await this.pool.query(
      'SELECT id, name FROM question_category WHERE name = $1',
      [name]
    )
    return result.rows[0] ?? null
  }

  async create({ name }) {
    const result = await this.pool.query(
      `INSERT INTO question_category (name)
       VALUES ($1)
       RETURNING id, name`,
      [name]
    )
    return result.rows[0]
  }

  async update(id, { name }) {
    const result = await this.pool.query(
      `UPDATE question_category
       SET name = COALESCE($1, name)
       WHERE id = $2
       RETURNING id, name`,
      [name ?? null, id]
    )
    return result.rows[0] ?? null
  }

  async delete(id) {
    const result = await this.pool.query(
      'DELETE FROM question_category WHERE id = $1',
      [id]
    )
    return result.rowCount > 0
  }

  async hasLinkedQuestions(id) {
    const result = await this.pool.query(
      'SELECT 1 FROM question WHERE question_category_id = $1 LIMIT 1',
      [id]
    )
    return result.rowCount > 0
  }
}