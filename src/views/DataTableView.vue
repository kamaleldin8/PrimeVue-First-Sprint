<template>
  <div class="card">
    <!-- <div class="flex justify-content-center align-items-center mb-4 gap-2">
      <InputSwitch v-model="metaKey" inputId="input-metakey" />
      <label for="input-metakey">Single Selection</label>
    </div> -->
    <DataTable
      v-model:filters="filters"
      v-model:editingRows="editingRows"
      @row-edit-save="onRowEditSave"
      tableClass="editable-cells-table"
      editMode="row"
      :value="customers"
      paginator
      filterDisplay="row"
      :metaKeySelection="metaKey"
      v-model:expandedRows="expandedRows"
      v-model:selection="selectedCustomers"
      @rowReorder="onRowReorder"
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
    >
      <!-- multiSeletion -->
      <Column selectionMode="multiple" :exportable="false"></Column>

      <!-- add new row and delete -->
      <template #header>
        <div class="flex justify-content-between" style="margin: 0">
          <div class="flex flex-wrap gap-2">
            <Button
              text
              icon="pi pi-plus"
              label="Expand All"
              @click="expandAll"
            />
            <Button
              text
              icon="pi pi-minus"
              label="Collapse All"
              @click="collapseAll"
            />
          </div>
          <div class="add-delete-row flex gap-5">
            <Button
              label="New"
              icon="pi pi-plus"
              severity="success"
              class="mr-2"
              @click="openNew"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              @click="confirmDeleteSelected"
              :disabled="!selectedCustomers || !selectedCustomers.length"
            />
          </div>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </span>
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

      <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="false" />

      <Column expander></Column>

      <Column
        header="Name"
        rowReorder
        sortable
        field="name"
        style="min-width: 12rem"
      >
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
        <template #body="{ data }">
          <div>
            <span>{{ data.name }}</span>
          </div>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            placeholder="search by name"
          />
          <Button @click="hideDialog">ss</Button>
        </template>
      </Column>
      <Column
        header="Balance"
        sortable
        field="balance"
        style="min-width: 12rem"
        :style="useRowEditing === false ? 'display: none' : ''"
      >
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Search by Balance"
          />
        </template>
      </Column>
      <Column
        header="company"
        sortable
        field="company"
        style="min-width: 12rem"
      >
        <template #editor="{ data, field }">
          <InputText v-model="data[field]"> </InputText>
        </template>
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <span>{{ data.company }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            @input="filterCallback()"
            class="p-column-filter"
            placeholder="Search by Company"
          />
        </template>
      </Column>

      <!-- <Column
        :rowEditor="true"
        style="width: 10%; min-width: 8rem"
        bodyStyle="text-align:center"
      ></Column> -->
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
              severity="danger"
              @click="confirmDeleteCustomer(slotProps.data)"
            />
          </div>
        </template>
      </Column>

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
        <!-- <div class="field">
          <label for="country">Countrty</label>
          <Textarea
            id="country"
            v-model="customer.country"
            required="true"
            rows="3"
            cols="20"
          />
        </div> -->

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
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { CustomerService } from "../service/ProductService";
const customers = ref();
const customer = ref();
const submitted = ref(false);
const selectedCustomers = ref();
const metaKey = ref(true);
const expandedRows = ref([]);
const editingRows = ref([]);
const deleteCustomerDialog = ref(false);
const deleteCustomersDialog = ref(false);
const customerDialog = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  // "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
  // toast.add({
  //   severity: "success",
  //   summary: "Successful",
  //   detail: "Product Deleted",
  //   life: 3000,
  // });
};
const confirmDeleteSelected = () => {
  console.log("confirmed");
  deleteCustomersDialog.value = true;
};
const saveProduct = () => {
  submitted.value = true;
  if (customer.value.name.trim()) {
    if (customer.value.id) {
      // // customer.value.inventoryStatus = customer.value.inventoryStatus.value
      //   ? customer.value.inventoryStatus.value
      //   : customer.value.inventoryStatus;
      customers.value[findIndexById(customer.value.id)] = customer.value;
      // toast.add({
      //   severity: "success",
      //   summary: "Successful",
      //   detail: "Customer Updated",
      //   life: 3000,
      // });
    } else {
      customer.value.id = createId();
      customer.value.code = createId();
      customer.value.inventoryStatus = customer.value.inventoryStatus
        ? customer.value.inventoryStatus.value
        : "INSTOCK";
      customers.value.push(customer.value);
      // toast.add({
      //   severity: "success",
      //   summary: "Successful",
      //   detail: "customer Created",
      //   life: 3000,
      // });
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
  // toast.add({
  //   severity: "success",
  //   summary: "Successful",
  //   detail: "Customer Deleted",
  //   life: 3000,
  // });
};

const onRowReorder = (event) => {
  customers.value = event.value;
  toast.add({ severity: "success", summary: "Rows Reordered", life: 3000 });
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
const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case "INSTOCK":
      return "success";

    case "LOWSTOCK":
      return "warning";

    case "OUTOFSTOCK":
      return "danger";

    default:
      return null;
  }
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
// const darkModeFunc = () => {
//   // let cardElement = document.querySelector(".card");
//   let DataTable = document.querySelector(".p-datatable-tbody");
//   // cardElement.classList.toggle("dark-mode");
//   console.log(DataTable);
//   DataTable.classList.toggle("dark-mode");
// };
</script>
<style scoped></style>