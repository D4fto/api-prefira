# API-PREFIRA

API RESTful para um jogo como "Would You Rather", onde usuários respondem perguntas de escolha entre duas opções, veem estatísticas de como outros usuários votaram e podem deixar uma review em cada resposta.

## Domínio

- **user**: quem usa a aplicação (login, e-mail, username).
- **question_category**: categoria de uma pergunta (ex: "Comida", "Viagem").
- **question**: a pergunta em si, com duas opções (`option1`/`option2`) e contadores de escolha, vinculada a uma categoria.
- **question_statistics**: estatísticas agregadas de uma pergunta (likes, dislikes, views) — relação **1:1** com `question`.
- **user_has_question**: tabela pivô — registra qual opção cada usuário escolheu em cada pergunta e sua review — relação **N:N** entre `user` e `question`.

## Arquitetura

- **Vertical Slice**: cada funcionalidade (`user`, `auth`, `question-category`, ...) vive em sua própria pasta dentro de `src/features/`, com seu próprio Controller, Service, Repository e Errors.
- **Camadas**:
  - **Controller**: só lida com `request`/`reply`.
  - **Service**: regras de negócio, sem SQL e sem conhecimento de HTTP.
  - **Repository**: única camada que importa `pg` (via `Pool`) e roda queries.
- **Injeção de Dependência**: nenhuma classe usa `new` dentro de si mesma. A montagem (`Repository → Service → Controller`) acontece nos arquivos `*.routes.js`.
- **Erros centralizados**: toda regra de negócio violada ou recurso não encontrado lança uma subclasse de `AppError`. Um Error Handler global (`shared/http/error-handler.js`) transforma isso em resposta JSON padronizada (`{ status, message }`), sem precisar de `if` no Controller.
- **Documentação**: cada rota tem um schema OpenAPI, exposto via Swagger em `/docs`.

## Stack

- Node.js + Fastify
- PostgreSQL (`pg`, com `Pool`, sem ORM)
- JWT (`jsonwebtoken`) para autenticação
- `bcryptjs` para hash de senha
- `@fastify/swagger` + `@fastify/swagger-ui` para documentação

## Como rodar localmente

### 1. Pré-requisitos

- Node.js instalado
- PostgreSQL rodando localmente (ou acessível via URL de conexão)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
JWT_SECRET=algum-segredo-bem-grande-e-aleatorio
```


### 5. Subir o servidor

```bash
node src/server.js
```

O servidor sobe em `http://localhost:3000`.

## Documentação (Swagger)

Com o servidor rodando, acesse:

```
http://localhost:3000/docs
```

Todos os endpoints estão documentados lá, com os formatos de body esperados e as respostas de sucesso/erro.