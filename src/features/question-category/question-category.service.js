// @file: src/features/question-category/question-category.service.js
import {
  QuestionCategoryNotFoundError,
  QuestionCategoryInUseError,
  QuestionCategoryValidationError,
} from './question-category.errors.js'

export class QuestionCategoryService {
  constructor(repository) {
    this.repository = repository
  }

  async listCategories() {
    return this.repository.findAll()
  }

  async getCategoryById(id) {
    const category = await this.repository.findById(id)

    if (!category) {
      throw new QuestionCategoryNotFoundError()
    }

    return category
  }

  async createCategory({ name }) {
    if (!name || name.trim() === '') {
      throw new QuestionCategoryValidationError('O nome da categoria é obrigatório.')
    }

    return this.repository.create({ name })
  }

  async updateCategory(id, { name }) {
    const category = await this.getCategoryById(id) // lança 404 se não existir

    if (name && name !== category.name) {
      const existingCategory = await this.repository.findByName(name)

      if (existingCategory && existingCategory.id !== category.id) {
        throw new QuestionCategoryNameAlreadyExistsError()
      }
    }

    return this.repository.update(id, { name })
  }

  async deleteCategory(id) {
    await this.getCategoryById(id) // garante existência, senão lança 404

    const hasLinkedQuestions = await this.repository.hasLinkedQuestions(id)

    if (hasLinkedQuestions) {
      throw new QuestionCategoryInUseError()
    }

    return this.repository.delete(id)
  }
}