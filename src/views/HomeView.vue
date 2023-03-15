<template>
  <div>
    <h1>My Content</h1>
    <router-link to="/progress" :value="value">
      Go To ProgressBar Component
    </router-link>
    <br />
    <router-link to="/datatable"> Go To DataTable </router-link>
    <!-- <div> -->
    <!-- <div > -->

    <!-- <div :class="{ invisible: value1 }">I'm visible!</div> -->
    <div v-if="name">I'm visible! {{ name }}</div>
    <div v-if="seen">kamal</div>
    <button @click="seen = !seen">Click Me</button>
    <!-- <button @click="hide">click</button> -->
    <!-- <div :class="{ invisible: !value2 }">Only my space is visible!</div> -->
    <!-- <div>Dummy text</div>
    <button @click="value1 = !value1">Click</button> -->
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
  /* visibility: hidden; */
}
</style>
