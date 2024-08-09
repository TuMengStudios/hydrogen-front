// define  vue 实例变量
// app.config.globalProperties.$abc = "";

// import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { get, put, post } from "@/api/request";

// 使用 getCurrentInstance()?.appContext.app.config.globalProperties.$abc;
export declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $abc: string;
    $dayjs: dayjs;
    $get: get;
    $put: put;
    $post: post;
  }
}
