export class UserHasQuestionController {
  constructor(service) {
    this.service = service;
  }

  async create(request, reply) {
    // request.user.sub geralmente contém o ID do usuário após o authGuard verificar o token
    const userId = request.user.sub; 
    const data = request.body;
    
    const result = await this.service.registerInteraction(userId, data);
    return reply.status(201).send(result);
  }
}