// @file: src/features/user/user.controller.js
export class UserController {
  constructor(service) {
    this.service = service
  }

  async list(request, reply) {
    const users = await this.service.listUsers()
    return reply.send(users)
  }

  async getById(request, reply) {
    const { id } = request.params
    const user = await this.service.getUserById(id)
    return reply.send(user)
  }

  async create(request, reply) {
    const user = await this.service.createUser(request.body)
    return reply.status(201).send(user)
  }

  async update(request, reply) {
    const { id } = request.params
    const user = await this.service.updateUser(id, request.body)
    return reply.send(user)
  }

  async remove(request, reply) {
    const { id } = request.params
    await this.service.deleteUser(id)
    return reply.status(204).send()
  }
}