<script setup>
const value = 70;
</script>
<template>
  <div>
    <h1>My Content</h1>
    <data-table-test></data-table-test>
    <router-link to="/progress" :value="value">
      Go To ProgressBar Component
    </router-link>
    <br />
    <router-link to="/datatable"> Go To DataTable </router-link>
  </div>
</template>
