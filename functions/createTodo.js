
import { createResponse } from '../lib/http.js';
import { createTodo } from '../lib/todos.js';

/**
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
export const handler = async (event) => {
  try {
    const { title, description } = JSON.parse(event.body);
    
    if (!title) {
      return createResponse(400, { error: 'Title is required' });
    }

    const todo = await createTodo(title, description);
    return createResponse(201, todo);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Could not create todo' });
  }
}; 