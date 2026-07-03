// @file: src/features/auth/auth.controller.js
export class AuthController {
  constructor(service) {
    this.service = service
  }

  async login(request, reply) {
    const result = await this.service.login(request.body)
    return reply.send(result)
  }
}