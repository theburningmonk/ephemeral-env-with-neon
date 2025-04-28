import { describe, it, expect, beforeAll } from 'vitest';
import { neon } from '@neondatabase/serverless';
import { createTodo } from '../../lib/todos.js';
import { Chance } from 'chance';
const chance = new Chance();

const sql = neon(process.env.DATABASE_URL);

describe('getTodos API', () => {

  beforeAll(async () => {
    await createTodo(chance.sentence(), chance.paragraph());
    await createTodo(chance.sentence(), chance.paragraph());
  });

  it('should retrieve all todos', async () => {
    const response = await fetch(`${process.env.ServiceEndpoint}/todos`);
    const todos = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(todos)).toBe(true);
    
    // there might be more than 2 todos in the database because
    // of other tests, so we just need to ensure that there are at least 2
    expect(todos.length).toBeGreaterThanOrEqual(2);

    todos.forEach(todo => {
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('description');
      expect(todo).toHaveProperty('completed');
      expect(todo).toHaveProperty('created_at');
    });
  });

  it('should return empty array when no todos exist', async () => {
    await sql`DELETE FROM todos`;

    const response = await fetch(`${process.env.ServiceEndpoint}/todos`);
    const todos = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBe(0);
  });
});