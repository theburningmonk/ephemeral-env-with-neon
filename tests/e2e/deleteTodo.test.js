import { describe, it, expect, beforeAll } from 'vitest';
import { createTodo, getTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

describe('deleteTodo API', () => {
  let id;

  beforeAll(async () => {
    const todo = await createTodo(chance.sentence(), chance.paragraph());
    id = todo.id;
  });

  it('should delete a todo from the database', async () => {
    const response = await fetch(`${process.env.API_URL}/todos/${id}`, {
      method: 'DELETE'
    });

    expect(response.status).toBe(204);

    const dbTodo = await getTodo(id);
    expect(dbTodo).toBe(null);
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await fetch(`${process.env.API_URL}/todos/${chance.guid()}`, {
      method: 'DELETE'
    });

    expect(response.status).toBe(404);
  });
}); 