import { describe, it, expect, beforeAll } from 'vitest';
import { handler } from '../../functions/getTodo.js';
import { createTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

describe('getTodo Handler', () => {
  const title = chance.sentence();
  const description = chance.paragraph();
  let id;

  beforeAll(async () => {
    const todo = await createTodo(title, description);
    id = todo.id;
  });

  it('should retrieve a todo by id', async () => {
    const event = {
      pathParameters: {
        id
      }
    };

    const response = await handler(event);
    const todo = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(todo.id).toBe(id);
    expect(todo.title).toBe(title);
    expect(todo.description).toBe(description);
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