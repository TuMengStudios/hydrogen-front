import { createRouter, createWebHashHistory } from "vue-router";
import Demo from "@/components/demo/Demo.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Demo,
    },
  ],
});

export { router };
