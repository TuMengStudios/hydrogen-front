/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 定义 meta env
// eslint-disable-next-line no-unused-vars
interface ImportMetaEnv {
  readonly VITE_TITLE: string; // vite title 名称
  readonly VITE_APP_BASE_URL: string; // vite app base url 的路径
}
