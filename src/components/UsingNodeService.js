import NodeService from "../../service/NodeService";

export default {
  data() {
    return {
      nodes: null,
    };
  },
  nodeService: null,
  created() {
    this.nodeService = new NodeService();
  },
  mounted() {
    this.nodeService.getTreeNodes().then((data) => (this.nodes = data));
  },
  methods: {
    expandAll() {
      for (let node of this.nodes) {
        this.expandNode(node);
      }

      this.expandedKeys = { ...this.expandedKeys };
    },
    collapseAll() {
      this.expandedKeys = {};
    },
    expandNode(node) {
      this.expandedKeys[node.key] = true;
      if (node.children && node.children.length) {
        for (let child of node.children) {
          this.expandNode(child);
        }
      }
    },
  },
};
