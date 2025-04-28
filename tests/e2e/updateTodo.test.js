import { describe, it, expect, beforeAll } from 'vitest';
import { createTodo, getTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

describe('updateTodo API', () => {
  let id;

  beforeAll(async () => {
    const todo = await createTodo(chance.sentence(), chance.paragraph());
    id = todo.id;
  });

  it('should update a todo in the database', async () => {
    const response = await fetch(`${process.env.API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true
      })
    });

    const todo = await response.json();

    expect(response.status).toBe(200);
    expect(todo.id).toBe(id);
    expect(todo.title).toBe('Updated Todo');
    expect(todo.description).toBe('Updated Description');
    expect(todo.completed).toBe(true);
  });

  it('should update only specified fields', async () => {
    const oldTodo = await getTodo(id);

    const response = await fetch(`${process.env.API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Partially Updated Todo'
      })
    });

    const todo = await response.json();

    expect(response.status).toBe(200);
    expect(todo.id).toBe(id);
    expect(todo.title).toBe('Partially Updated Todo');
    // Other fields should remain unchanged
    expect(todo.description).toBe(oldTodo.description);
    expect(todo.completed).toBe(oldTodo.completed);
  });

  it('should return 404 for non-existent todo', async () => {
    const response = await fetch(`${process.env.API_URL}/todos/${chance.guid()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: chance.sentence(),
        description: chance.paragraph(),
        completed: true
      })
    });

    expect(response.status).toBe(404);
  });

  it('should handle invalid JSON in request body', async () => {
    const response = await fetch(`${process.env.API_URL}/todos/${chance.guid()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid-json'
    });

    expect(response.status).toBe(500);
  });
}); 