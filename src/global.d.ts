// define  vue 实例变量
// app.config.globalProperties.$abc = "";
// 使用 getCurrentInstance()?.appContext.app.config.globalProperties.$abc;
export declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $abc: string;
  }
}
