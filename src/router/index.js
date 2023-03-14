import { createRouter, createWebHistory } from "vue-router";
import AppLayout from "@/layout/AppLayout.vue";
import HomeView from "../views/HomeView.vue";
import ProgressView from "../views/ProgressView.vue";
import DataTableView from "../views/DataTableView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: AppLayout,
      children: [
        {
          path: "/",
          component: HomeView,
        },
        {
          path: "/progress",
          component: ProgressView,
        },
        {
          path: "/datatable",
          component: DataTableView,
        },
      ],
    },
  ],
});

export default router;
