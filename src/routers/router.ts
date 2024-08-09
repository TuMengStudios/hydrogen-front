import { createRouter, createWebHashHistory } from "vue-router";

import ConfigTask from "@/components/task/ConfigTask.vue";
import TaskList from "@/components/task/TaskList.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: TaskList,
    },
    {
      path: "/config",
      component: ConfigTask,
    },
    {
      path: "/tasklist",
      component: TaskList,
    },
  ],
});

export { router };
