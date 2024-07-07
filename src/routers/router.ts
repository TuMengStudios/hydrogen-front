import { createRouter, createWebHashHistory } from "vue-router";
import DebugView from "@/components/task/DebugView.vue";
import TaskList from "@/components/task/TaskList.vue";
import Counter from "@/components/Counter.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: TaskList,
    },
    {
      path: "/debug",
      component: DebugView,
    },
    {
      path: "/tasklist",
      component: TaskList,
    },
    {
      path: "/counter",
      component: Counter,
    },
  ],
});

export { router };
