// @file: src/shared/http/schemas.js
export const errorResponseSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    message: { type: 'string' },
  },
}