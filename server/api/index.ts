import { v4 as uuidv4 } from 'uuid';

interface TodoModel {
  id: string;
  name: string;
  isCompleted: boolean;
}

let todos: TodoModel[] = [];


export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    return todos;
  } else if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    const newTodo = {
      id: uuidv4(),
      name: body.name,
      isCompleted: false
    };
    todos.push(newTodo);
    return newTodo;
  } else if (event.node.req.method === 'PUT') {
    const body = await readBody(event);
    const index = todos.findIndex((todo) => todo.id === body.id);
    if (index !== -1) {
      todos[index].isCompleted = !todos[index].isCompleted;
      return todos[index];
    } else {
      event.node.res.statusCode = 404; // Not Found
      return { message: 'Todo not found' };
    }
  } else if (event.node.req.method === 'DELETE') {
    const body = await readBody(event);
    const index = todos.findIndex((todo) => todo.id === body.id);
    if (index !== -1) {
      todos.splice(index, 1);
      event.node.res.statusCode = 204; // No Content
    } else {
      event.node.res.statusCode = 404; // Not Found
      return { message: 'Todo not found' };
    }
  } else {
    event.node.res.statusCode = 405; // Method Not Allowed
    return null;
  }
});
