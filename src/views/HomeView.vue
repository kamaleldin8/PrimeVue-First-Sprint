<template>
  <div>
    <h1>My Content</h1>
    <router-link to="/progress" :value="value">
      Go To ProgressBar Component
    </router-link>
    <br />
    <router-link to="/datatable"> Go To DataTable </router-link>
    <div v-if="name">I'm visible! {{ name }}</div>
    <div v-if="seen">kamal</div>
    <button @click="seen = !seen">Click Me</button>
  </div>
</template>
<script setup>
import { ref } from "vue";
const value = 70;
let seen = ref(false);

let name = "";

const hide = () => {
  console.log("clicked" + " " + seen);

  seen = !seen;
};
</script>
<style scoped>
.invisible {
  background: red;
  display: none;
}
</style>
