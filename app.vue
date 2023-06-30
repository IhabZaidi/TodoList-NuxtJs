<template>
  <div class="mx-auto w-1/2 py-6">
    <h1 class="text-2xl font-bold mb-4">Todos App</h1>
    <form class="flex space-x-2 mt-4 " @submit.prevent="createTodo">
      <input type="text" v-model="newTodoName" placeholder="New Todo Here" class="flex-1 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-500">
      <button type="submit" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Add Todo</button>
    </form>
    <ul class="space-y-2">
      <li v-for="todo in todos" :key="todo.id" class="flex flex-row justify-between bg-gray-100 space-x-6 p-4 rounded">
        <div class="container flex flex-col">
          <p class="text-lg">{{ todo.name }}</p>
          <p class="text-sm">{{ todo.isCompleted ? 'Completed' : 'Not completed' }}</p>
        </div>
        <button @click="updateTodoStatus(todo)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-44">Toggle Status</button>
        <button @click="deleteTodo(todo)" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Delete</button>
      </li>
    </ul>
  </div>


</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const newTodoName = ref('');
let todos = reactive([]);

const fetchTodos = async () => {
  try {
    const response = await axios.get('/api/');
    todos.splice(0, todos.length, ...response.data);
  } catch (error) {
    console.error(error);
  }
};

const createTodo = async () => {
  try {
    const response = await axios.post('/api/', {
      name: newTodoName.value,
      isCompleted: false
    });
    todos.push(response.data);
    newTodoName.value = '';
  } catch (error) {
    console.error(error);
  }
};

const updateTodoStatus = async (todo) => {
  try {
    const response = await axios.put(`/api/`, {
      id: todo.id,
    });
    const index = todos.findIndex((t) => t.id === response.data.id);
    if (index !== -1) {
      todos[index] = response.data;
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteTodo = async (todo) => {
  try {
    await axios.delete(`/api/${todo.id}`);
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos.splice(index, 1);
    }
  } catch (error) {
    console.error(error);
  }
};

fetchTodos();
</script>

