<template>
  <div>
    <el-input v-model="debugText" :rows="2" type="textarea" placeholder="Please input" />
    <el-button @click="debug">调试</el-button>
    <el-button @click="preview">预览</el-button>
  </div>
  <!-- 递归组件 -->
  <DebugItem :debug-node="debugRes"></DebugItem>
  <div>
    <el-table :data="data.previewRes" stripe style="width: 100%">
      <el-table-column v-for="(item, index) in data.keys.sort()" :key="index" :prop="item" :label="item">
        <template #default="scope">
          <div>{{ previewFormat(scope.row, item) }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <div>
    <div><span>数据源</span></div>
    <div>
      <el-select v-model="data.src_type" class="m-2" placeholder="Select" size="large">
        <el-option v-for="item in src_options" :key="item.value.toString()" :label="item.label.toString()" :value="item.value" />
      </el-select>
      <!-- <el-input v-model="data.src_broker" placeholder="src broker address" clearable /> -->
      <el-input v-model="data.src_config" placeholder="src config" clearable />
      <!-- <el-input v-model="data.src_topic" placeholder="kafka src topic" clearable></el-input> -->
    </div>
    <div>
      <el-button :disabled="data.src_config.length == 0" @click="kafkaConnectTest">连通性测试</el-button>
    </div>
  </div>
  <div>
    <div><span>落库</span></div>
    <div>
      <el-select v-model="data.dst_type" class="m-2" placeholder="Select" size="large">
        <el-option v-for="item in dst_options" :key="item.value.toString()" :label="item.label.toString()" :value="item.value" />
      </el-select>
    </div>
    <div>
      <!-- <el-input v-model="data.dst_broker" placeholder="dst broker address" clearable /> -->
      <!-- <el-input v-model="data.dst_topic" placeholder="kafka dst topic" clearable></el-input> -->
      <el-input v-model="data.dst_config" placeholder="dst config" clearable></el-input>
    </div>
    <div>
      <el-button @click="dstTestingConnecting">连通性测试</el-button>
    </div>
    <div>
      <el-input v-model="data.name" placeholder="task name" clearable></el-input>
    </div>
    <div>
      <div>
        <el-button v-if="MODE === MODE_NEW" @click="commitTask">新增</el-button>
        <el-button v-else @click="updateTask">更新</el-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, toRaw } from "vue";
import { debugTask, debugTaskPreview, DebugTaskResponse, commitTaskBackend, Normal, Fold, Ignore, kafkaTest } from "@/components/task/DebugTask";
import { ElMessage } from "element-plus";
import DebugItem from "./DebugItem.vue";
import { MODE_NEW, MODE_MODIFY, SRC_LIST, DST_LIST, DebugTaskPreviewResponse, fetchTask, TaskInfo } from "@/components/task/types";

let debugText = ref("");
let debugRes = ref<DebugTaskResponse>(<DebugTaskResponse>{});

const getQueryVar = (paramName: string): undefined | string => {
  // console.log('search.....', window.location)
  // http://127.0.0.1:5173/#/debug?id=660d34a606031be82b621fc6
  let query = window.location.hash.substring(window.location.hash.indexOf("?") + 1);
  // console.log('query ', query)
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] === paramName) {
      return pair[1];
    }
    return undefined;
  }
};

const MODE = getQueryVar("id") == undefined ? MODE_NEW : MODE_MODIFY;

console.log("mode==", MODE);
let src_options = SRC_LIST;
let dst_options = DST_LIST;

onMounted(() => {
  const id = getQueryVar("id");
  if (MODE === MODE_NEW || !id || id === "") {
    return;
  }
  // 处理更新 task 的逻辑
  fetchTask(id).then((task: TaskInfo) => {
    console.log("fetch task ", task);
    debugText.value = task.debug_text;
    // debugRes.value = task
    debug().then(() => {
      preview();
    });
  });
});

const previewFormat = (debug: Map<string, any>, key: string): any => {
  let m = new Map(Object.entries(debug));
  if (typeof m.get(key) === "object") {
    return JSON.stringify(m.get(key));
  } else {
    return m.get(key);
  }
};

// {"name":"uxx","age":18,"is_ok":true}
const debug = async () => {
  if (!isJson(debugText.value)) {
    ElMessage.warning("不是标准的 json 格式的文本");
    return Promise.reject("not json");
  }
  try {
    let data = JSON.parse(debugText.value);
    let res = await debugTask("_", data);
    console.log("debug task is ", res);
    print_res(res, 0);
    resetDebugRes(res);
    debugRes.value = res;
  } catch (err) {
    console.log("error ", err);
  } finally {
    // return Promise.resolve();
  }
};

const resetDebugRes = (res: DebugTaskResponse) => {
  res.op = Normal;
  for (let item of res.props) {
    resetDebugRes(item);
  }
};

const print_res = (r: DebugTaskResponse, depth: number) => {
  for (let item of r.props) {
    console.log("r = ", item);
    print_res(item, depth + 1);
  }
};
//
const isJson = (str: any): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (err) {
    return false;
  }
};

const kafkaConnectTest = () => {
  if (!data.src_config) {
    ElMessage({ message: "无效的配置参数", type: "warning" });
    return;
  }
  console.log("test kafka ", data.src_config);
  kafkaTest(data.src_config);
};

const preview = () => {
  if (!isJson(debugText.value)) {
    ElMessage({ message: "不是标准的 json 格式的文本", type: "warning" });
    return;
  }
  let debug = JSON.parse(debugText.value);
  console.log("..", toRaw(debugRes.value));
  let ignore: string[] = [];
  ignore = buildIgnore(debugRes.value, "", "_", ignore);
  let fold: string[] = [];
  fold = buildFold(debugRes.value, "", "_", fold);
  console.log("ignore === ", ignore);
  console.log("fold === ", fold);
  debugTaskPreview("_", debug, ignore, fold, 100).then((res: DebugTaskPreviewResponse) => {
    if (res.length <= 0 || res[0].size == 0) {
      console.log("exit.......", res);
      return;
    }

    console.log("debug preview ... ", res);
    data.previewRes = res;
    data.keys = Object.keys(res[0]);
  });
};

const buildIgnore = (res: DebugTaskResponse, pre: string, sep: string, ignore: string[]): string[] => {
  let key: string = "";
  if (pre === "" && res.name === "") {
    key = "";
  } else if (pre === "" && res.name !== "") {
    key = res.name;
  } else {
    key = pre + sep + res.name;
  }
  if (res.op === Ignore) {
    console.log("push....", res.op, key, pre, res.name);

    ignore.push(key);
  }

  for (let item of res.props) {
    ignore = buildIgnore(item, key, sep, ignore);
  }
  return ignore;
};

const buildFold = (res: DebugTaskResponse, pre: string, sep: string, fold: string[]): string[] => {
  let key: string = "";
  if (pre === "" && res.name === "") {
    key = "";
  } else if (pre === "" && res.name !== "") {
    key = res.name;
  } else {
    key = pre + sep + res.name;
  }
  if (res.op === Fold) {
    console.log("build fold push....", res.op, key, pre, res.name);

    fold.push(key);
    return fold;
  }

  for (let item of res.props) {
    fold = buildFold(item, key, sep, fold);
  }
  return fold;
};
//
let data = reactive<{
  previewRes: Map<String, any>[];
  keys: string[];
  src_type: string;
  dst_type: string;
  // src_topic: string,
  // src_broker: string,
  src_config: string;
  // dst_broker: string,
  // dst_topic: string,
  dst_config: string;
  name: string;
}>({
  previewRes: [],
  keys: [],
  src_type: "kafka",
  dst_type: "kafka",
  src_config: "broker=localhost:9092&topic=abc_src",
  dst_config: "broker=localhost:9092&topic=abc_dst",
  name: "",
});

// const testConnecting = () => {
//   console.log("testConnecting");
//   testKafkaSrcConnecting("kafka", data.src_config).then((res) => {
//     console.log("connecting res is ", res);
//     if (res.err_no !== 10000) {
//       console.log("show message box");
//       ElMessage({ message: "连通性测试失败:" + "不存在", type: "warning" });
//     }
//   });
// };

// 测试链接
const dstTestingConnecting = () => {
  console.log("dstTestingConnecting");
};

const commitTask = () => {
  console.log("commitTask");
  let ignore: string[] = [];
  ignore = buildIgnore(debugRes.value, "", "_", ignore);
  let fold: string[] = [];
  fold = buildFold(debugRes.value, "", "_", fold);
  commitTaskBackend(
    data.name,
    data.src_type,
    {
      decoder: "json",
      // broker: data.src_broker,
      // topic: data.src_topic,
      src_config: data.src_config,
    },
    data.dst_type,
    {
      encoder: "json",
      // broker: data.dst_broker,
      // topic: data.dst_topic,
      dst_config: data.dst_config,
    },
    {
      sep: "_",
      ignore: ignore,
      fold: fold,
      max_depth: -1,
    },
    JSON.parse(debugText.value),
    debugRes.value,
  ).then((res) => {
    console.log("res===", res);
  });
};

const updateTask = () => {
  console.log("update task");
  ElMessage({ message: "更新成功", type: "success" });
};
//
// interface DebugTaskSrcInfo {
//   src_type: string; // 数据源类型
//   params: string; // 配置键值对 broker=localhost:9200&topic=abc_dst
// }

// interface DebugTaskDstInfo {
//   dst_type: string; // 目标端数据源类型
//   params: string; // 配置键值对 et: broker=localhost:9090&topic=abc&begin=start
// }

// interface DebugTaskInfo {
//   id: string; // 作业 id
//   name: string; // 作业的名称
//   debug_text: string;
//   DebugTaskSrcInfo: DebugTaskSrcInfo;
//   DebugTaskDstInfo: DebugTaskDstInfo;
// }

// const debug2 = reactive<DebugTaskInfo>(<DebugTaskInfo>{
//   id: getQueryVar("id") || "",
// });
</script>
<style scoped lang="css"></style>
