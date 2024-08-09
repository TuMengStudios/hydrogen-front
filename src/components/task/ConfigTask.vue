<template>
  <!-- name -->
  <div class="name-container">
    <!-- <span>task name</span> -->
    <el-input v-model="raw_data.task.name">
      <template #prepend><span>task-name</span></template>
    </el-input>

  </div>
  <div style="padding: 8px;">
    <el-tooltip content="0 mean ignore json nested depth">
      <span>max depth</span>
    </el-tooltip>
    <el-input-number :controls="false" v-model="raw_data.task.parser_config.max_depth" type="number">
      <template #prepend> <span>max-depth</span></template>
    </el-input-number>
  </div>
  <div>
    <!-- strict mode -->
    <el-tooltip class="item-box" content="if used strict mode will ignore extract field not found in debug text">
      <span class="text-5">strict-mode</span>
    </el-tooltip>
    <el-radio-group class="text-5" v-model="raw_data.task.parser_config.strict_mode">
      <el-radio :label="true">Yes</el-radio>
      <el-radio :label="false">No</el-radio>
    </el-radio-group>
  </div>

  <div>
    <el-tooltip content="field sep char or string" placement="right-start">
      <!-- <span>split key</span> -->
    </el-tooltip>
    <el-input v-model="raw_data.task.parser_config.sep">
      <template #prepend>
        <span>split-key</span>
      </template>
    </el-input>
  </div>

  <div class="debug-container">
    <span class="" style="">
      <Icon icon="fluent:text-t-24-filled" :size="23"></Icon>
    </span>
    <el-input clearable v-model="raw_data.plain_text" :rows="5" type="textarea"
      placeholder="please input json format as debug text" :autosize="{ minRows: 3 }" @input="onPlainTextChange">
    </el-input>
    <div v-if="debug_text_error_info" style="color:red">{{ debug_text_error_info }}</div>
  </div>

  <!-- property -->
  <div v-if="raw_data.task.property_item !== undefined">
    <span>property item</span>
    <Item v-if="raw_data.task.property_item !== undefined" :item="raw_data.task.property_item"
      @on_op_change="parserPlainText"></Item>
  </div>
  <!-- result -->
  <div>
    <div v-if="data.parserPlainTextResponse && data.parserPlainTextResponseKeys.length > 0">
      <div class="font-sans" >debug result</div>
      <el-table v-if="data.parserPlainTextResponse" :data="data.parserPlainTextResponse">
        <el-table-column v-if="data.parserPlainTextResponseKeys"
          v-for="(key, index) in data.parserPlainTextResponseKeys" :key="index" :prop="key" :label="key"
          max-width="180">
        </el-table-column>
        {{ 2 }}
      </el-table>
    </div>
  </div>

  <div>
    <span> {{ raw_data.task.src_config.name }} data source</span>
    <div v-if="raw_data.task.src_config.name == 'kafka'">
      <KafkaSrc :source_config="raw_data.task.src_config.val"></KafkaSrc>
    </div>
    <div v-else-if="raw_data.task.dst_config.name == 'empty'">
      <div>empty</div>
    </div>
    <div v-else>not implement</div>
  </div>

  <div>
    <!-- data sink -->
    <div>{{ raw_data.task.dst_config.name }}</div>
    <div v-if="raw_data.task.dst_config.name == 'kafka'">
      <KafkaDst :dst_config="raw_data.task.dst_config.val"></KafkaDst>
    </div>
  </div>

  <div style="display: flex; align-items: center; justify-items: center;">
    <el-button v-if="raw_data.task.id == ''" @click="onCreateTask" size="large">create</el-button>
    <el-button v-else @click="updateTask" size="large">update</el-button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Icon } from "@iconify/vue";

import Item from './Item.vue';
import KafkaSrc from './KafkaSrc.vue';
import {
  onMounted,
  reactive,
  getCurrentInstance,
  ref,
} from "vue";

import { post, get, put } from '@/api/request';
import { ElMessage } from "element-plus";
import {
  CreateTaskResponse,
  defaultTaskInfo,
  ParserPlainTextRequest,
  ParserPlainTextResponse,
  ParserPropertyRequest,
  ParserPropertyResponse,
  StatusCreated,
  TaskInfo,
} from "./types";

import { computeFold, computeIgnore, computeKey } from './util';

const { appContext } = getCurrentInstance()!;
const router = useRouter();

const raw_data = reactive<{
  task: TaskInfo,
  plain_text: string,
}>({
  task: defaultTaskInfo(),
  plain_text: '',
});

const debug_text_error_info = ref<string | undefined>(undefined)

onMounted(() => {
  let id = router.currentRoute.value.query['id'] || undefined;
  if (id === undefined) {
    console.log('invalid id')
    return;
  }


  console.debug('task id ', id);

  get<TaskInfo>(`/task/${id}`, {}).then((res) => {
    console.log('task ', res);
    if (res.err_no !== 10000) {
      ElMessage({ message: `${res.err_no}#${res.err_msg}`, type: 'error' }, appContext);
      return;
    }

    raw_data.task = res.data;
    raw_data.plain_text = JSON.stringify(res.data.debug_text);
    console.log('raw data ', raw_data);
  })
});


const data = reactive<
  {
    parserPlainTextRequest: ParserPlainTextRequest,
    parserPlainTextResponse: ParserPlainTextResponse,
    parserPlainTextResponseKeys: string[],
  }>(
    {
      parserPlainTextRequest: <ParserPlainTextRequest>{},
      parserPlainTextResponse: <ParserPlainTextResponse>{},
      parserPlainTextResponseKeys: [],
    });


const onPlainTextChange = (val: string) => {
  console.log('value ', val);
  try {
    raw_data.task.debug_text = JSON.parse(val);
    debug_text_error_info.value = undefined;
    parserProperty();
  } catch (err) {
    debug_text_error_info.value = `${err}`;
  }
}

const parserProperty = () => {
  try {
    let obj = JSON.parse(raw_data.plain_text);
    let req: ParserPropertyRequest = { sep: raw_data.task.parser_config.sep, plain_text: obj };
    post<ParserPropertyResponse>('/debug/property', req).then((res) => {
      console.log('res ', res);
      if (res.err_no === 10000) {
        raw_data.task.property_item = res.data.item;
      } else {
        ElMessage({ message: res.err_msg, type: 'error' }, appContext);
      }
    });
  } catch (err) {
    ElMessage({ message: `${err}`, type: 'error' }, appContext);
  }
}

const parserPlainText = () => {
  try {
    data.parserPlainTextRequest.sep = raw_data.task.parser_config.sep;
    data.parserPlainTextRequest.debug_text = JSON.parse(raw_data.plain_text);
    let item = raw_data.task.property_item;
    let sep = raw_data.task.parser_config.sep;
    data.parserPlainTextRequest.fold = computeFold(item, "", sep);
    data.parserPlainTextRequest.keys = computeKey(item, "", sep);
    data.parserPlainTextRequest.ignore = computeIgnore(item, "", sep);
    data.parserPlainTextRequest.max_depth = raw_data.task.parser_config.max_depth
    data.parserPlainTextRequest.strict_mode = false;
    data.parserPlainTextRequest.default_value = new Map();
    console.log('req ', JSON.stringify(data.parserPlainTextRequest));
    post<ParserPlainTextResponse>('/debug/parser', data.parserPlainTextRequest).then(res => {
      console.log(res);
      data.parserPlainTextResponse = res.data;
      if (res.data.length > 0) {
        data.parserPlainTextResponseKeys = Object.keys(res.data[0]).sort();
      }
      console.log(data);
    })

  } catch (err) {
    ElMessage({ message: `${err}`, type: 'error' }, appContext);
  }

}

const onCreateTask = async () => {

  if (raw_data.task.property_item === undefined || !raw_data.task.property_item) {
    ElMessage({ message: 'please parser property before', type: 'error' }, appContext);
    return;
  }

  if (!raw_data.task.name) {
    ElMessage({ message: 'please input task name before create task', type: 'error' }, appContext);
    return;
  }

  if (!raw_data.plain_text) {
    ElMessage({ message: "please input debug text before create task", type: 'error' }, appContext);
    return;
  }

  raw_data.task.parser_config.fold = computeFold(raw_data.task.property_item, "", raw_data.task.parser_config.sep);
  raw_data.task.parser_config.keys = computeKey(raw_data.task.property_item, "", raw_data.task.parser_config.sep);
  raw_data.task.parser_config.ignore = computeIgnore(raw_data.task.property_item, "", raw_data.task.parser_config.sep);

  try {
    raw_data.task.parser_config.debug_text = JSON.parse(raw_data.plain_text);
  } catch (err) {
    ElMessage({ message: `debug text not valid json format ?? ${err} please check`, type: 'error' }, appContext)
    return;
  }
  // post<CreateTaskResponse>("/task", createTaskReq).then(res => {
  post<CreateTaskResponse>("/task", raw_data.task).then(res => {
    console.log(res.data);
    if (res.err_no === 10000) {
      ElMessage({ message: `${res.err_no}#${res.err_msg}`, type: "success" });
      router.push({ path: "/tasklist", query: { 'status': StatusCreated } })
      return;
    } else {
      ElMessage({ message: `${res.err_no}#${res.err_msg}`, type: "error" });

    }
  }).catch(err => {
    ElMessage({ message: `${err.response.data}`, type: "error" });
    return
  })
};



const updateTask = () => {
  console.log(raw_data.task);
  raw_data.task.parser_config.keys = computeKey(raw_data.task.property_item, "", raw_data.task.parser_config.sep)
  raw_data.task.parser_config.ignore = computeIgnore(raw_data.task.property_item, "", raw_data.task.parser_config.sep)
  raw_data.task.parser_config.fold = computeFold(raw_data.task.property_item, "", raw_data.task.parser_config.sep)
  put("/task", raw_data.task).then(res => {
    console.log("update task", res);
    if (res.err_no === 10000) {
      ElMessage({ message: `${res.err_no}#${res.err_msg}`, type: "success" });
      router.push({ path: "/tasklist", query: { 'status': StatusCreated } })
    } else {
      ElMessage({ message: `${res.err_no}#${res.err_msg}`, type: "error" })
    }
  }).catch(err => {
    console.error("update task error ", err);
    ElMessage({ message: `${err.response.data}`, type: "error" });
    return
  }).catch(err => {
    ElMessage({ message: `${err}` }, appContext)
  })
}

</script>
<style lang="css" scoped>
.data-source {
  display: flex;
}

.name-container {
  display: flex;
  padding-left: 8px;
  padding-right: 16px;
  /* padding-bottom: 8px; */
}

.debug-container {
  display: flex;
  align-items: center;
  padding: 16px;
}
</style>
