<template>
    <div class="row">
      <div class="col-6">
  
        <draggable
          :list="list"
        >
          <template #item="{ element }">
            <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
              {{ element}}
            </div>
          </template>
        </draggable>
      </div>
  
      <!-- <rawDisplayer class="col-3" :value="list" title="List" /> -->
    </div>
  </template>
  
  <script>
  import draggable from "vuedraggable"
  let id = 1;
  export default {
    name: "simple",
    display: "Simple",
    order: 0,
    components: {
      draggable
    },
    data() {
      return {
        enabled: true,
        list: [
          { name: "nada", id: 0 },
          { name: "toka", id: 1 },
          { name: "Jean", id: 2 }
        ],
      };
    },
    computed: {
     
    },
    methods: {
  
    }
  };
  </script>
  <style scoped>

  </style>