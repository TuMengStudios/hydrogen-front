import { createApp } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
// 引入Elmessage和Elloading的css样式文件
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import { createPinia } from "pinia";

import App from "@/App.vue";
import { router } from "@/routers/router";
import "@/style.css";

const app = createApp(App);

app.use(router);
let pinia = createPinia();
app.use(pinia);

app.config.globalProperties.$abc = "test-case";

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");
