<script setup>
import ProgressComponent from "./ProgressComponent.vue";
const value = 80;
</script>
<template>
  <div>
    <h1>ProgressBar</h1>
    <progress-component :value="value" />
  </div>
</template>
