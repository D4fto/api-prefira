import Fastify from 'fastify'
import cors from '@fastify/cors'
import { errorHandler } from "./shared/http/error-handler.js";


const server = Fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

server.setErrorHandler(errorHandler);

server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    status: 'error',
    message: 'O recurso solicitado não existe nesta API.'
  })
})

const PORT = 3000

const start = async () => {
  try {
    await server.listen({ port: PORT })
    console.log(`Servidor rodando em <http://localhost>:${PORT}`)
  } catch (erro) {
    console.error('Falha ao iniciar a aplicação:', erro)
    process.exit(1)
  }
}

start()