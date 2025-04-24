import { describe, it, expect, beforeAll } from 'vitest';
import { handler } from '../../functions/updateTodo.js';
import { createTodo, getTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

describe('updateTodo Handler', () => {
  let id;

  beforeAll(async () => {
    const todo = await createTodo(chance.sentence(), chance.paragraph());
    id = todo.id;    
  });

  it('should update a todo in the database', async () => {
    const event = {
      pathParameters: {
        id
      },
      body: JSON.stringify({
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true
      })
    };

    const response = await handler(event);
    const todo = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(todo.id).toBe(id);
    expect(todo.title).toBe('Updated Todo');
    expect(todo.description).toBe('Updated Description');
    expect(todo.completed).toBe(true);
  });

  it('should update only specified fields', async () => {
    const event = {
      pathParameters: {
        id
      },
      body: JSON.stringify({
        title: 'Partially Updated Todo'
      })
    };

    const oldTodo = await getTodo(id);

    const response = await handler(event);
    const todo = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(todo.id).toBe(id);
    expect(todo.title).toBe('Partially Updated Todo');
    // Other fields should remain unchanged
    expect(todo.description).toBe(oldTodo.description);
    expect(todo.completed).toBe(oldTodo.completed);
  });

  it('should return 404 for non-existent todo', async () => {
    const event = {
      pathParameters: {
        id: chance.guid()
      },
      body: JSON.stringify({
        title: 'Updated Todo'
      })
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(404);
  });

  it('should handle invalid JSON in request body', async () => {
    const event = {
      pathParameters: {
        id
      },
      body: 'invalid-json'
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(500);
  });
}); 