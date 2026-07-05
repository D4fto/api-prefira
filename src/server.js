import Fastify from 'fastify'
import cors from '@fastify/cors'
import { errorHandler } from "./shared/http/error-handler.js";
import userRoutes from './features/user/user.routes.js'
import authRoutes from './features/auth/auth.routes.js'
import questionCategoryRoutes from './features/question-category/question-category.routes.js'
import pool from './database/pool.js'

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

server.register(userRoutes)
server.register(authRoutes)
server.register(questionCategoryRoutes)

const PORT = 3000

const start = async () => {
  try {
    // Faz um teste simples para confirmar que o banco está acessível
    await pool.query('SELECT 1')
    console.log('Conectado ao PostgreSQL com sucesso')


    await server.listen({ port: PORT })
    console.log(`Servidor rodando em <http://localhost>:${PORT}`)
  } catch (erro) {
    console.error('Falha ao iniciar a aplicação:', erro)
    process.exit(1)
  }
}

start()