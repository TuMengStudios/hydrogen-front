import moment from "moment";
import { get, post, Response } from "@/api/request";

export interface TaskInfo {
  id: String;
  name: String;
  src_type: String;
  dst_type: String;
  src_cfg: Map<String, any>;
  dst_cfg: Map<String, any>;
  tasking_cfg: TaskingCfg;
  last_heartbeat: number;
  created_at: number;
  updated_at: number;
  status: number;
  debug_text: string;
}

export interface TaskingCfg {
  max_depth: number;
  fold: Set<String>;
  ignore: Set<String>;
  sep: String;
}

export interface TaskListRequest {
  status: number;
  page: number;
  page_size: number;
}

export const newTaskListRequest = (status: number, page: number, page_size: number): TaskListRequest => {
  return { status, page, page_size };
};
// 获取指定状态的作业
export const fetchTaskList = async (status: number, page: number, page_size: number): Promise<[TaskInfo]> => {
  const res = await get<[TaskInfo]>("/task/list", newTaskListRequest(status, page, page_size), undefined);
  return res.data;
};
// 获取单个 task
export const fetchTask = async (taskId: string): Promise<TaskInfo> => {
  const res = await get<TaskInfo>("/task/" + taskId, undefined, undefined);
  return res.data;
};

// 计算作业的数量
export const countTask = async (status: number): Promise<number> => {
  let res = await get<number>("/task/count", { status: status });
  return res.data;
};

export const startTaskBackend = (id: String): Promise<Response<string>> => {
  // task_id=657a6d0e3054105018dbaf58
  return get("/task/start", {
    task_id: id,
  });
};

export const stopTaskBackend = (id: String): Promise<Response<string>> => {
  return post("/task/cancel", undefined, { task_id: id });
};

export const tsFormat = (ts: number): String => {
  let date = new Date(ts * 1000);
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

// 预览调试结果
type DebugTaskPreviewResponse = [Map<String, any>];

export { type DebugTaskPreviewResponse };

interface DataTypeDef {
  value: String;
  label: String;
}

// 接收的数据源类型
const SRC_LIST: [DataTypeDef] = [{ value: "kafka", label: "kafka" }];
const DST_LIST: [DataTypeDef] = [{ value: "kafka", label: "kafka" }];
//

const MODE_NEW = "NEW"; // 新增
const MODE_MODIFY = "MODIFY"; // 更新|修改

// eslint-disable-next-line no-unused-vars
type TaskConfig = {
  debug_text: string;
  properties: string[];
  name: string;
  src_config: string;
  dst_config: string;
};

export { MODE_MODIFY, MODE_NEW, SRC_LIST, DST_LIST };
