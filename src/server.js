// @file: src/server.js
import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { errorHandler } from "./shared/http/error-handler.js"
import userRoutes from './features/user/user.routes.js'
import authRoutes from './features/auth/auth.routes.js'
import questionCategoryRoutes from './features/question-category/question-category.routes.js'
import questionRoutes from './features/question/question.routes.js'
import userHasQuestionRoutes from './features/user-has-question/user-has-question.routes.js'
import pool from './database/pool.js'

const server = Fastify()

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
})

// 1. Registro do Swagger (OpenAPI)
server.register(swagger, {
  openapi: {
    info: {
      title: 'API de Questões',
      description: 'Documentação da API do Trabalho Prático',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
})

// 2. Registro da Interface Visual do Swagger
server.register(swaggerUi, {
  routePrefix: '/docs', // Rota para acessar a documentação no navegador
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
})

server.setErrorHandler(errorHandler)

server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    status: 'error',
    message: 'O recurso solicitado não existe nesta API.'
  })
})

// Registro das Rotas
server.register(userRoutes)
server.register(authRoutes)
server.register(questionCategoryRoutes)
server.register(questionRoutes)
server.register(userHasQuestionRoutes)

const PORT = 3000

const start = async () => {
  try {
    await pool.query('SELECT 1')
    console.log('Conectado ao PostgreSQL com sucesso')

    await server.listen({ port: PORT })
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`Documentação disponível em http://localhost:${PORT}/docs`)
  } catch (erro) {
    console.error('Falha ao iniciar a aplicação:', erro)
    process.exit(1)
  }
}

start()