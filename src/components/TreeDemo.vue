<template>
  <div>
    <h5>Basic</h5>
    <Tree :value="nodes"></Tree>

    <h5>Programmatic Control</h5>
    <div style="margin-bottom: 1em">
      <Button
        type="button"
        icon="pi pi-plus"
        label="Expand All"
        @click="expandAll"
      />
      <Button
        type="button"
        icon="pi pi-minus"
        label="Collapse All"
        @click="collapseAll"
      />
    </div>
    <Tree :value="nodes" v-model:expandedKeys="expandedKeys"></Tree>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import NodeService from "../../service/NodeService";
import Tree from "primevue/tree";
import Button from "primevue/button";

export default {
  setup() {
    onMounted(() => {
      nodeService.value.getTreeNodes().then((data) => (nodes.value = data));
    });

    const nodes = ref();
    const expandedKeys = ref({});
    const nodeService = ref(new NodeService());
    const expandAll = () => {
      for (let node of nodes.value) {
        expandNode(node);
      }

      expandedKeys.value = { ...expandedKeys.value };
    };
    const collapseAll = () => {
      expandedKeys.value = {};
    };
    const expandNode = (node) => {
      if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.children) {
          expandNode(child);
        }
      }
    };

    return {
      nodes,
      expandedKeys,
      nodeService,
      expandAll,
      collapseAll,
      expandNode,
      Button,
      Tree,
    };
  },
};
</script>

<style scoped>
.p-button {
  margin-right: 0.5rem;
}
</style>
