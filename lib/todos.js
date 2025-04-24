import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.DATABASE_URL);

export const createTodo = async (title, description) => {
  const id = uuidv4();
  const result = await sql`INSERT INTO todos (id, title, description, completed, created_at)
      VALUES (${id}, ${title}, ${description}, ${false}, ${new Date().toISOString()})
      RETURNING *`;

  return result[0];
};

export const deleteTodo = async (id) => {
  const result = await sql`DELETE FROM todos WHERE id = ${id} RETURNING *`;

  if (result.length === 0) {
    return null;
  }

  return result[0];
};

export const getTodo = async (id) => {
  const result = await sql`SELECT * FROM todos WHERE id = ${id}`;

  if (result.length === 0) {
    return null;
  }

  return result[0];
};

export const getTodos = async () => {
  const result = await sql`SELECT * FROM todos ORDER BY created_at DESC`;

  return result;
};

export const updateTodo = async (id, title, description, completed) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (title !== undefined) {
    updates.push(`title = $${paramCount}`);
    values.push(title);
    paramCount++;
  }

  if (description !== undefined) {
    updates.push(`description = $${paramCount}`);
    values.push(description);
    paramCount++;
  }

  if (completed !== undefined) {
    updates.push(`completed = $${paramCount}`);
    values.push(completed);
    paramCount++;
  }

  values.push(id);

  const result = await sql.query(`UPDATE todos 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING *`, values);

  if (result.length === 0) {
    return null;
  }

  return result[0];
};
