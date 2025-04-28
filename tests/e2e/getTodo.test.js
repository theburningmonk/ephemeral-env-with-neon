import { describe, it, expect, beforeAll } from 'vitest';
import { createTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

describe('getTodo API', () => {
  const title = chance.sentence();
  const description = chance.paragraph();
  let id;

  beforeAll(async () => {
    const todo = await createTodo(title, description);
    id = todo.id;
  });

  it('should retrieve a todo by id', async () => {
    const response = await fetch(`${process.env.API_URL}/todos/${id}`);
    const todo = await response.json();

    expect(response.status).toBe(200);
    expect(todo.id).toBe(id);
    expect(todo.title).toBe(title);
    expect(todo.description).toBe(description);
    expect(todo.completed).toBe(false);
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await fetch(`${process.env.API_URL}/todos/${chance.guid()}`);
    expect(response.status).toBe(404);
  });
}); 