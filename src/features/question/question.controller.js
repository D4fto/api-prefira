export class QuestionController {
  constructor(service) {
    this.service = service;
  }

  async create(request, reply) {
    const data = request.body;
    const result = await this.service.createQuestion(data);
    return reply.status(201).send(result);
  }

  async findAll(request, reply) {
    const questions = await this.service.getAllQuestions();
    return reply.status(200).send(questions);
  }

  async delete(request, reply) {
    const { id } = request.params;
    await this.service.deleteQuestion(id);
    return reply.status(204).send();
  }
}