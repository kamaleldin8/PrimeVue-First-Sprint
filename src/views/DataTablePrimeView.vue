<template>
  <div>
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <template #header>
        <div style="text-align: left">
          <MultiSelect
            :modelValue="selectedColumns"
            :options="columns"
            optionLabel="header"
            @update:modelValue="onToggle"
            display="chip"
            placeholder="Select Columns"
          />
        </div>
      </template>
      <Column field="code" header="Code" />
      <Column
        v-for="(col, index) of selectedColumns"
        :field="col.field"
        :header="col.header"
        :key="col.field + '_' + index"
      ></Column>
    </DataTable>
  </div>
</template>

<script>
import { ProductService } from "@/service/ProductServicePrime";

export default {
  data() {
    return {
      selectedColumns: null,
      columns: null,
      products: null,
    };
  },
  created() {
    this.columns = [
      { field: "name", header: "Name" },
      { field: "category", header: "Category" },
      { field: "quantity", header: "Quantity" },
    ];
    this.selectedColumns = this.columns;
  },
  mounted() {
    ProductService.getProductsMini().then((data) => (this.products = data));
  },
  methods: {
    onToggle(value) {
      this.selectedColumns = this.columns.filter((col) => value.includes(col));
    },
  },
};
</script>
