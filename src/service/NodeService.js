export default class NodeService {
  getTreeNodes() {
    return fetch("../src/treenodes.json")
      .then((res) => res.json())
      .then((d) => d.root);
  }
}
