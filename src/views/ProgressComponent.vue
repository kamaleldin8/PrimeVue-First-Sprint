<script setup>
// import { usePrimeVue } from "primevue/config";
const props = defineProps(["value"]);

// const PrimeVue = usePrimeVue();
// PrimeVue.changeTheme(
//   "lara-light-indigo",
//   "lara-light-indigo",
//   "primevue/resources/themes/lara-light-indigo/theme.css",
//   () => {}
// );
</script>
<template>
  <div class="progress-wrapper">
    <div class="progress-row">
      <ProgressBar :value="value" class="progress-bar" />
      <ProgressBar mode="indeterminate" class="progress-bar" />
      <ProgressBar :value="value" class="progress-bar">
        Percent Complete: {{ value }}%
      </ProgressBar>
    </div>

    <div class="progress-row">
      <ProgressBar :value="value" class="second-progress-bar" />
      <ProgressBar mode="indeterminate" class="second-progress-bar" />
      <ProgressBar :value="value" class="second-progress-bar">
        Percent Complete: {{ value }}%
      </ProgressBar>
    </div>
    <!-- <Button type="button" label="Button 1" class="" severity="help"></Button> -->

    <div
      class="flex flex-column md:flex-row md:justify-content-between row-gap-3"
    >
      <Button type="button" label="Button 1"></Button>
      <Button
        type="button"
        label="Button 2"
        severity="secondary"
        style="backgroundColor: red"
        p-sr-only
        class="p-disabled"
      ></Button>
      <Button
        type="button"
        label="Button"
        class="p-link"
      ></Button>
    </div>
  </div>
</template>

<style scoped>
.progress-wrapper {
  display: flex;
  flex-direction: column;
}
.progress-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 3em;
}
.progress-bar,
.second-progress-bar {
  width: 15em;
  height: 2em;
  background: var(--focus-ring);
  box-shadow: var(--focus-ring);
}
.second-progress-bar {
  box-shadow: 0 0 0 0.2rem #dde0ea;
}
</style>
