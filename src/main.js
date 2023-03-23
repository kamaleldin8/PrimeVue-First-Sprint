import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import ProgressBar from "primevue/progressbar";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputSwitch from "primevue/inputswitch";
import Column from "primevue/column";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import TextArea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import MultiSelect from "./components/MultiSelect.vue";
import router from "./router";
import { createStore } from "vuex";
import "@/assets/styles.scss";

const app = createApp(App);
const store = createStore({
  state() {
    return {
      disabledIDS: [],
    };
  },
});
app.use(PrimeVue, { ripple: true });
app.use(router);
app.component("Tag", Tag);
app.component("TextArea", TextArea);
app.component("Dialog", Dialog);
app.component("ProgressBar", ProgressBar);
app.component("MultiSelect", MultiSelect);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("InputSwitch", InputSwitch);
app.component("Dropdown", Dropdown);
app.component("Column", Column);
app.use(store);
app.mount("#app");
