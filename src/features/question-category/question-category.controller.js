// @file: src/features/question-category/question-category.controller.js
export class QuestionCategoryController {
  constructor(service) {
    this.service = service
  }

  async list(request, reply) {
    const categories = await this.service.listCategories()
    return reply.send(categories)
  }

  async getById(request, reply) {
    const { id } = request.params
    const category = await this.service.getCategoryById(id)
    return reply.send(category)
  }

  async create(request, reply) {
    const category = await this.service.createCategory(request.body)
    return reply.status(201).send(category)
  }

  async update(request, reply) {
    const { id } = request.params
    const category = await this.service.updateCategory(id, request.body)
    return reply.send(category)
  }

  async remove(request, reply) {
    const { id } = request.params
    await this.service.deleteCategory(id)
    return reply.status(204).send()
  }
}