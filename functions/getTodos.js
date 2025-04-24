import { createResponse } from '../lib/http.js';
import { getTodos } from '../lib/todos.js';

/**
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
export const handler = async () => {
  try {
    const todos = await getTodos();

    return createResponse(200, todos);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Could not fetch todos' });
  }
}; 