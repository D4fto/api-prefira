// @file: src/shared/http/error-handler.js
import { AppError } from "../errors/app-error.js";

export function errorHandler(error, request, reply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message
    });
  }

  // Esta linha vai imprimir o erro exato da base de dados no seu terminal!
  console.error("ERRO INTERNO DETETADO:", error);

  return reply.status(500).send({
    status: "error",
    message: "Erro interno do servidor."
  });
}