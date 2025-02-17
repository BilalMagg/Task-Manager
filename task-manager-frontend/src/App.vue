<template>
  <div>
    <h1>Task Manager</h1>
    <p :style="{ color: dbStatus === 'Database is online' ? 'green' : 'red' }">
      {{ dbStatus }}
    </p>
    <TaskList />
  </div>
</template>

<script>
import TaskList from './components/TaskList.vue';
import axios from 'axios';

export default {
  components: { TaskList },
  data() {
    return {
      dbStatus: 'Checking...',
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:5000/status');
      this.dbStatus = response.data.status;
    } catch (error) {
      this.dbStatus = 'Database is offline';
    }
  }
};
</script>
