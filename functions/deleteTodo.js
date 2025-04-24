import { createResponse } from '../lib/http.js';
import { deleteTodo } from '../lib/todos.js';

/**
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
export const handler = async (event) => {
  try {
    const { id } = event.pathParameters;

    const todo = await deleteTodo(id);

    if (!todo) {
      return createResponse(404, { error: 'Todo not found' });
    }

    return createResponse(204);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Could not delete todo' });
  }
}; 