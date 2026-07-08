export class UserHasQuestionController {
  constructor(service) {
    this.service = service;
  }

  async list(request, reply) {
    const interactions = await this.service.listInteractions();
    return reply.send(interactions);
  }

  async create(request, reply) {
    // request.user.sub geralmente contém o ID do usuário após o authGuard verificar o token
    const userId = request.user.sub; 
    const data = request.body;
    
    const result = await this.service.registerInteraction(userId, data);
    return reply.status(201).send(result);
  }

  async update(request, reply) {
    const userId = request.user.sub;
    const { questionId } = request.params;
    const interaction = await this.service.updateInteraction(userId, questionId, request.body);
    return reply.send(interaction);
  }
 
  async remove(request, reply) {
    const userId = request.user.sub;
    const { questionId } = request.params;
    await this.service.removeInteraction(userId, questionId);
    return reply.status(204).send();
  }
}