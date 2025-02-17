<template>
  <div id="app">
    <h1>Task List</h1>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        <input type="checkbox" v-model="task.completed" @change="updateTask(task)">
        <span :class="{ completed: task.completed }">{{ task.title }}</span>
        <small>Created: {{ formatDate(task.created_at) }}</small>
        <small v-if="task.deadline">Deadline: {{ formatDate(task.deadline) }}</small>
        <button @click="editTask(task)">Edit</button>
        <button @click="deleteTask(task.id)">Delete</button>
      </li>
    </ul>

    <input v-model="newTaskTitle" placeholder="Enter new task">
    <input type="datetime-local" v-model="newTaskDeadline">
    <button class="add-task-btn" @click="addTask">Add Task</button>

    <div v-if="editingTask">
      <input v-model="editingTask.title">
      <input type="datetime-local" v-model="editingTask.deadline">
      <button @click="saveTask">Save</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      newTaskTitle: '',
      newTaskDeadline: '',
      editingTask: null,
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        this.tasks = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },

    async addTask() {
      if (!this.newTaskTitle) return;
      await axios.post('http://localhost:5000/tasks', { 
        title: this.newTaskTitle, 
        deadline: this.newTaskDeadline || null 
      });
      this.newTaskTitle = '';
      this.newTaskDeadline = '';
      this.fetchTasks();
    },

    async deleteTask(id) {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      this.fetchTasks();
    },

    editTask(task) {
      this.editingTask = { ...task };
    },

    async saveTask() {
      await axios.put(`http://localhost:5000/tasks/${this.editingTask.id}`, this.editingTask);
      this.editingTask = null;
      this.fetchTasks();
    },

    async updateTask(task) {
      await axios.put(`http://localhost:5000/tasks/${task.id}`, task);
    },

    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString();
    }
  }
};
</script>

<style>
.completed {
  text-decoration: line-through;
  color: gray;
}
</style>
