import { describe, it, expect, beforeAll } from 'vitest';
import { handler } from '../../functions/deleteTodo.js';
import { createTodo, getTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

describe('deleteTodo Handler', () => {
  let id;

  beforeAll(async () => {
    const todo = await createTodo(chance.sentence(), chance.paragraph());
    id = todo.id;
  });

  it('should delete a todo from the database', async () => {
    const event = {
      pathParameters: {
        id
      }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(204);

    const dbTodo = await getTodo(id);
    expect(dbTodo).toBe(null);
  });

  it('should return 404 for non-existent todo', async () => {
    const event = {
      pathParameters: {
        id: chance.guid()
      }
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(404);
  });
}); 