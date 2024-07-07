import { Response, get, post } from "@/api/request";
import { DebugTaskPreviewResponse } from "@/components/task/types";

// new request
interface TaskRequest {
  name: String;
  src_type: String;
  src_cfg: Map<String, any>;
  dst_type: String;
  dst_cfg: Map<String, any>;
  tasking_cfg: TaskingCfg;
}

// eslint-disable-next-line no-unused-vars
interface KafkaSrcCfg {
  broker: String;
  topic: String;
}

// eslint-disable-next-line no-unused-vars
interface KafkaDstCfg {
  broker: String;
  topic: String;
}

// tasking config
interface TaskingCfg {
  ignore: Set<String>;
  fold: Set<String>;
  sep: String;
  max_depth: Number;
}

export const Normal = "normal";
export const Fold = "fold";
export const Ignore = "ignore";

export { type TaskRequest, type TaskingCfg };

export interface DebugTaskResponse {
  name: string; // 属性名/字段名
  property_type: string; //字段类型
  props: [DebugTaskResponse]; // 子属性/如果是 array/object时可能会存在子属性
  op: string; // 链接符号
  operator: string; // fold/ignore/normal
}

export const debugTask = async (sep: string, data: any): Promise<DebugTaskResponse> => {
  const res = await post<DebugTaskResponse>("/task/debug", {
    sep: sep,
    debug: data,
  });
  return res.data;
};

export const debugTaskPreview = async (sep: String, data: any, ignore: string[], fold: string[], max_depth: number): Promise<DebugTaskPreviewResponse> => {
  const res = await post<DebugTaskPreviewResponse>("/task/debug/preview", {
    sep: sep,
    debug: data,
    max_depth: max_depth,
    ignore: ignore,
    fold: fold,
  });
  return res.data;
};

export const testKafkaSrcConnecting = (
  detect_type: String,
  // broker: string,
  src_config: string,
  // topic: string
): Promise<Response<string>> => {
  return post("/connect_testing", {
    detect_type: detect_type,
    cfg: src_config,
  });
};

export const commitTaskBackend = (
  name: string,
  src_type: string,
  src_cfg: {},
  dst_type: string,
  dst_cfg: {},
  tasking_cfg: {},
  debug_text: undefined,
  properties: {},
): Promise<any> => {
  return post("/task/new", {
    name,
    src_type,
    src_cfg,
    dst_cfg,
    dst_type,
    tasking_cfg,
    debug_text,
    properties,
  });
};

export const kafkaTest = (query: string) => {
  get("/connect_testing/kafka" + "?" + query).then((res: any) => {
    console.log("/connect_testing/kafka" + res);
  });
};
