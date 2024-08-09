import { createApp } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入Elmessage和Elloading的css样式文件
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";

import 'uno.css'

import log from "loglevel";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // +

import { createPinia } from "pinia";
import App from "@/App.vue";

import { router } from "@/routers/router";
import "@/style.css";

import { get, post, put } from "./api/request";

dayjs.extend(relativeTime);
const app = createApp(App);

app.use(router);
let pinia = createPinia();
app.use(pinia);

app.config.globalProperties.$abc = "test-case";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.config.globalProperties.$dayjs = dayjs;

// bind method
app.config.globalProperties.$get = get;
app.config.globalProperties.$post = post;
app.config.globalProperties.$put = put;

log.setLevel(0);

window.console.log = log.trace;
window.console.log = log.info;
window.console.debug = log.debug;
window.console.info = log.info;
window.console.warn = log.warn;
window.console.error = log.error;

app.mount("#app");
