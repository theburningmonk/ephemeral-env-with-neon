import { createResponse } from '../lib/http.js';
import { updateTodo } from '../lib/todos.js';

/**
 * @param {import('aws-lambda').APIGatewayEvent} event 
 * @returns {Promise<import('aws-lambda').APIGatewayProxyResult>}
 */
export const handler = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { title, description, completed } = JSON.parse(event.body);

    if (!title && !description && !completed) {
      return createResponse(400, { error: 'No valid fields to update' });
    }
    
    const todo = await updateTodo(id, title, description, completed);

    if (!todo) {
      return createResponse(404, { error: 'Todo not found' });
    }

    return createResponse(200, todo);
  } catch (error) {
    console.error('Error:', error);
    return createResponse(500, { error: 'Could not update todo' });
  }
}; 