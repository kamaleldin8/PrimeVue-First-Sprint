<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      v-model:editingRows="editingRows"
      v-model:expandedRows="expandedRows"
      @rowReorder="onRowReorder"
      :columns="displayedColumns"
      @row-edit-save="onRowEditSave"
      tableClass="editable-cells-table"
      editMode="row"
      :value="customers"
      paginator
      filterDisplay="row"
      v-model:selection="selectedCustomers"
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :disabled="disabled" :disabledId="disabledId"
    >
      <template #header>
        <div class="flex justify-content-between mb-2 inputs-parent">
          <div class="inputs">
            <MultiSelect
              :modelValue="selectedColumns"
              :options="columnsPrime"
              optionLabel="header"
              @update:modelValue="onToggle"
              display="chip"
              placeholder="Select Columns"
            />
          </div>
          <div class="inputs">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </div>
        <div
          class="flex justify-content-between buttons-parent"
          style="margin: 0"
        >
          <div class="flex buttons">
            <Button
              text
              icon="pi pi-plus"
              label="Expand All"
              @click="expandAll"
            ></Button>
            <Button
              text
              icon="pi pi-minus"
              label="Collapse All"
              @click="collapseAll"
            ></Button>
          </div>

          <div class="add-delete-row flex gap-5">
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="openNew"
            ></Button>
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              @click="confirmDeleteSelected"
              :disabled="!selectedCustomers || !selectedCustomers.length"
            ></Button>
          </div>
        </div>
      </template>
      <Dialog
        v-model:visible="deleteCustomerDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="customer"
            >Are you sure you want to delete <b>{{ customer.name }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            text
            @click="deleteCustomerDialog = false"
          />
          <Button label="Yes" icon="pi pi-check" text @click="deleteCustomer" />
        </template>
      </Dialog>
      <div :key="componentKey">
        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        >
        </Column>

        <Column :rowReorder="true" headerStyle="width: 3rem"></Column>

        <Column :expander="true"></Column>
        <Column
          v-for="(col, index) of selectedColumns"
          :field="col.field"
          :header="col.header"
          sortable
          :key="col.field + '_' + index"
        >
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <span>{{ data[`${col.header.toLowerCase()}`] }}</span>
            </div>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText
              v-model="filterModel.value"
              type="text"
              @input="filterCallback()"
              class="p-column-filter"
              placeholder="Filter"
            />
          </template>
        </Column>

        <Column :exportable="false" style="min-width: 4em">
          <template #body="slotProps">
            <div class="flex">
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="mr-2"
                @click="editCustomer(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                class="mr-2"
                severity="danger"
                @click="confirmDeleteCustomer(slotProps.data)"
              />
              <Button
                icon="pi pi-power-off"
                outlined
                rounded
                severity="danger"
                style="pointer-events: all !important"
                @click="disable(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </div>
      <Dialog
        v-model:visible="customerDialog"
        :style="{ width: '450px' }"
        header="Customer Details"
        :modal="true"
        class="p-fluid"
      >
        <div class="field">
          <label for="name">Name</label>
          <InputText
            id="name"
            v-model.trim="customer.name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.name }"
          />
          <small class="p-error" v-if="submitted && !customer.name"
            >Name is required.</small
          >
        </div>

        <div class="field">
          <label for="balance" class="mb-3">Balance</label>
          <InputText
            id="balance"
            v-model.trim="customer.balance"
            required="true"
            autofocus
          />
        </div>

        <div class="field">
          <label for="company" class="mb-3">Company</label>
          <InputText
            id="company"
            v-model.trim="customer.company"
            required="true"
            autofocus
          />
        </div>
        <template #footer>
          <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
          <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
        </template>
      </Dialog>
      <!-- expanded row -->
      <template #expansion="slotProps">
        <div class="p-3">
          <h5>Orders for {{ slotProps.data.name }}</h5>
          <DataTable :value="slotProps.data.orders">
            <Column field="id" header="Id" sortable></Column>
            <Column field="customer" header="Customer" sortable></Column>
            <Column field="amount" header="Amount" sortable>
              <template #body="slotProps">
                {{ formatCurrency(slotProps.data.amount) }}
              </template>
            </Column>
            <Column field="status" header="Status" sortable>
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.status.toLowerCase()"
                  :severity="getOrderSeverity(slotProps.data)"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
      <Dialog
        v-model:visible="deleteCustomerDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="customer"
            >Are you sure you want to delete <b>{{ customer.name }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            text
            @click="deleteCustomerDialog = false"
          />
          <Button label="Yes" icon="pi pi-check" text @click="deleteCustomer" />
        </template>
      </Dialog>

      <Dialog
        v-model:visible="deleteCustomersDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="customers"
            >Are you sure you want to delete the selected Customers?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            text
            @click="deleteCustomersDialog = false"
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            text
            @click="deleteSelectedCustomers"
          />
        </template>
      </Dialog>

      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text />
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-download" text />
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { FilterMatchMode } from "primevue/api";
import { ref, onMounted, computed } from "vue";
import { CustomerService } from "../service/ProductService";
import DataTable from "../components/DataTable.vue";
const componentKey = ref(0);
const customers = ref();
const customer = ref();
const submitted = ref(false);
const selectedCustomers = ref();
const expandedRows = ref([]);
const editingRows = ref([]);
const deleteCustomerDialog = ref(false);
const deleteCustomersDialog = ref(false);
const customerDialog = ref(false);
const disabled = ref(false);
const disabledId = ref(0);
const columns = ref([
  { field: "name", visible: true },
  { field: "company", visible: true },
  { field: "balance", visible: true },
]);
const columnsPrime = ref([
  { field: "name", header: "Name" },
  { field: "company", header: "Company" },
  { field: "balance", header: "Balance" },
]);
const selectedColumns = ref(columnsPrime.value);

const displayedColumns = computed(() =>
  columns.value.filter((column) => column.visible)
);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  balance: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  company: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

onMounted(() => {
  CustomerService.getCustomersMedium().then((data) => {
    customers.value = getCustomers(data);
  });
});

const getCustomers = (data) => {
  return [...(data || [])].map((d) => {
    return d;
  });
};
// add new row and delete
const openNew = () => {
  customer.value = {};
  submitted.value = false;
  customerDialog.value = true;
};

const hideDialog = () => {
  customerDialog.value = false;
  submitted.value = false;
};

const confirmDeleteCustomer = (prod) => {
  customer.value = prod;
  deleteCustomerDialog.value = true;
};
const deleteCustomer = () => {
  customers.value = customers.value.filter(
    (val) => val.id !== customer.value.id
  );
  deleteCustomerDialog.value = false;
  customer.value = {};
};
const confirmDeleteSelected = () => {
  console.log("confirmed");
  deleteCustomersDialog.value = true;
};
const saveProduct = () => {
  submitted.value = true;
  if (customer.value.name.trim()) {
    if (customer.value.id) {
      customers.value[findIndexById(customer.value.id)] = customer.value;
    } else {
      customer.value.id = createId();
      customer.value.code = createId();
      customer.value.inventoryStatus = customer.value.inventoryStatus
        ? customer.value.inventoryStatus.value
        : "INSTOCK";
      customers.value.push(customer.value);
    }
    customerDialog.value = false;
    customer.value = {};
  }
};
const editCustomer = (prod) => {
  customer.value = { ...prod };
  customerDialog.value = true;
};
const createId = () => {
  let id = "";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};
const deleteSelectedCustomers = () => {
  customers.value = customers.value.filter(
    (val) => !selectedCustomers.value.includes(val)
  );
  deleteCustomersDialog.value = false;
  selectedCustomers.value = null;
};

const disable = (prod) => {
  prod.disabled = !prod.disabled
  disabled.value = !disabled.value
  disabledId.value = prod.id;
  componentKey.value += 1;
};

const expandAll = () => {
  expandedRows.value = customers.value.filter((p) => p.id);
};
const collapseAll = () => {
  expandedRows.value = null;
};
const formatCurrency = (value) => {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
};
const onRowEditSave = (event) => {
  let { newData, index } = event;

  customers.value[index] = newData;
};
const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < customers.value.length; i++) {
    if (customers.value[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
};

const onToggle = (val) => {
  selectedColumns.value = columnsPrime.value.filter((col) => val.includes(col));
};
const getOrderSeverity = (order) => {
  switch (order.status) {
    case "DELIVERED":
      return "success";

    case "CANCELLED":
      return "danger";

    case "PENDING":
      return "warning";

    case "RETURNED":
      return "info";

    default:
      return null;
  }
};
</script>
<style scoped>
.inputs .p-input-icon-left > .p-inputtext {
  width: 16em;
}
@media screen and (max-width: 630px) {
  div.inputs-parent,
  div.buttons-parent {
    display: flex;
    flex-direction: column;
  }

  div.buttons-parent {
    align-items: center;
  }

  .inputs .p-multiselect {
    width: 100%;
    margin-bottom: 1em;
  }
  .inputs .p-input-icon-left {
    width: 100%;
  }
  .inputs .p-input-icon-left > .p-inputtext {
    width: 100%;
  }
}
</style>
