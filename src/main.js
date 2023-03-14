import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import ProgressBar from "primevue/progressbar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import DataTable from "primevue/datatable";
import InputSwitch from "primevue/inputswitch";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import TextArea from "primevue/textarea";
import router from "./router";

import "@/assets/styles.scss";

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.use(router);
app.component("Tag", Tag);
app.component("TextArea", TextArea);
app.component("Dialog", Dialog);
app.component("ProgressBar", ProgressBar);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("DataTable", DataTable);
app.component("InputSwitch", InputSwitch);
app.component("Column", Column);
app.mount("#app");
