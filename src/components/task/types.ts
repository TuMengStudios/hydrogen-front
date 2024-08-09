export interface PropertyRequest {
  sep: string;
  debug_text: any;
}

export interface Property {
  // name:string,
  sep: string;
  value: any;
  item: PropertyItem;
}

export type PropertyResponse = Property;

export interface PropertyItem {
  node_name: string;
  value_type: string;
  op?: string;
  props: PropertyItem[];
}

export const reset_property = (property: PropertyItem, op: string) => {
  property.op = op;
  for (let item of property.props) {
    reset_property(item, op);
  }
};

export const Keep = "keep";
export const Fold = "fold";
export const Ignore = "ignore";

export const ObjectType = "object";
export const ArrayType = "array";
export const StringType = "string";
export const NumberType = "number";
export const BooleanType = "boolean";
export const NullType = "null";

export interface TaskInfo {
  id: string;
  name: string;
  debug_text: any;
  status: number;
  parser_config: ParserConfig;
  src_config: SrcConfig;
  dst_config: DstConfig;
  heartbeat: number;
  updated_at: number;
  created_at: number;
  property_item: PropertyItem;
  handle_num: number;
  handle_err: number;
}

export const defaultTaskInfo = (): TaskInfo => {
  return {
    id: "",
    status: StatusCreated,
    name: "",
    parser_config: defaultParserConfig(),
    src_config: defaultSrcConfig(),
    dst_config: defaultDstConfig(),
    debug_text: {},
    updated_at: 0,
    heartbeat: 0,
    created_at: 0,
    property_item: { node_name: "", value_type: "null", props: [] },
    handle_err: 0,
    handle_num: 0,
  };
};

export interface FetchTaskListRequest {
  status: number;
  page: number;
  page_size: number;
}

export interface TaskStatusCountRequest {
  status: number;
}

export type TaskStatusCountResponse = number;

export const PAGE_SIZE: number = 10;

interface TaskStatusInfo {
  value: number;
  display_value: string;
}

// task status
export const StatusDeleted = -1;
export const StatusAll = 0;
export const StatusCreated = 1;
export const StatusStop = 10;
export const StatusRunning = 12;
export const StatusError = 16;

// task status list
export const StatusList: TaskStatusInfo[] = [
  { value: StatusDeleted, display_value: "deleted" },
  { value: StatusAll, display_value: "all" },
  { value: StatusCreated, display_value: "created" },
  { value: StatusStop, display_value: "stop" },
  { value: StatusRunning, display_value: "running" },
  { value: StatusError, display_value: "error" },
];

export interface CreateTaskRequest {
  name: string;
  parser_config: ParserConfig;
  dst_config: DstConfig;
  src_config: SrcConfig;
  debug_text: any;
  property_item: PropertyItem;
}

export type CreateTaskResponse = number;

export interface ParserConfig {
  max_depth: number;
  sep: string;
  keys: string[];
  ignore: string[];
  fold: string[];
  strict_mode: boolean;
  default_value: Map<string, any>;
  debug_text: any;
}

function defaultParserConfig(): ParserConfig {
  return {
    max_depth: 0,
    sep: "_",
    keys: [],
    ignore: [],
    fold: [],
    debug_text: {},
    default_value: new Map(),
    strict_mode: false,
  };
}

export interface SrcConfig {
  name: string;
  val: any;
}

function defaultSrcConfig(): SrcConfig {
  return {
    name: "kafka",
    val: <SrcKafkaConfig>{
      params: "",
      topic: "",
      group_id: "",
    },
  };
}
export interface SrcKafkaConfig {
  params: string;
  topic: string;
  group_id: string;
}

export interface DstConfig {
  name: string;
  val: any;
}

function defaultDstConfig(): DstConfig {
  return {
    name: "kafka",
    val: <DstKafkaConfig>{
      params: "",
      topic: "",
    },
  };
}

export interface DstKafkaConfig {
  params: string;
  topic: string;
}

export interface ParserPropertyRequest {
  sep: string;
  plain_text: any;
}

export type ParserPropertyResponse = Property;

export interface ParserPlainTextRequest {
  max_depth: number;
  sep: string;
  keys: string[];
  ignore: string[];
  fold: string[];
  default_value: Map<string, any>;
  strict_mode: boolean;
  debug_text: any;
}

export type ParserPlainTextResponse = Map<string, any>[];
