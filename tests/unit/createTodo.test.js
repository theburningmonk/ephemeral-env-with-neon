import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { handler } from '../../functions/createTodo.js';
import { getTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

describe('createTodo Handler', () => {
  it('should create a new todo in the database', async () => {
    const title = chance.sentence();
    const description = chance.paragraph();

    const event = {
      body: JSON.stringify({
        title,
        description
      })
    };

    const response = await handler(event);
    const todo = JSON.parse(response.body);

    expect(response.statusCode).toBe(201);
    expect(todo).toHaveProperty('id');
    expect(todo.title).toBe(title);
    expect(todo.description).toBe(description);
    expect(todo.completed).toBe(false);
    expect(todo).toHaveProperty('created_at');

    const dbTodo = await getTodo(todo.id);
    expect(dbTodo.title).toBe(todo.title);
    expect(dbTodo.description).toBe(todo.description);
    expect(dbTodo.completed).toBe(todo.completed);
  });

  it('should return 400 if title is missing', async () => {
    const event = {
      body: JSON.stringify({
        description: chance.paragraph()
      })
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(400);
  });
}); 