// @file: src/features/user/user.repository.js
export class UserRepository {
  constructor(pool) {
    this.pool = pool
  }

  async findAll() {
    const result = await this.pool.query(
      'SELECT id, email, username FROM "user" ORDER BY id'
    )
    return result.rows
  }

  async findById(id) {
    const result = await this.pool.query(
      'SELECT id, email, username FROM "user" WHERE id = $1',
      [id]
    )
    return result.rows[0] ?? null
  }

  async findByEmail(email) {
    const result = await this.pool.query(
      'SELECT id, email, password, username FROM "user" WHERE email = $1',
      [email]
    )
    return result.rows[0] ?? null
  }

  async findByUsername(username) {
    const result = await this.pool.query(
      'SELECT id, email, password, username FROM "user" WHERE username = $1',
      [username]
    )
    return result.rows[0] ?? null
  }

  async create({ email, passwordHash, username }) {
    const result = await this.pool.query(
      `INSERT INTO "user" (email, password, username)
       VALUES ($1, $2, $3)
       RETURNING id, email, username`,
      [email, passwordHash, username]
    )
    return result.rows[0]
  }

  async update(id, { email, username }) {
    const result = await this.pool.query(
      `UPDATE "user"
       SET email = COALESCE($1, email),
           username = COALESCE($2, username)
       WHERE id = $3
       RETURNING id, email, username`,
      [email ?? null, username ?? null, id]
    )
    return result.rows[0] ?? null
  }

  async delete(id) {
    const result = await this.pool.query('DELETE FROM "user" WHERE id = $1', [id])
    return result.rowCount > 0
  }
}