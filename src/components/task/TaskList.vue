<template>
  <div>
    状态
    <el-select v-model="data.req.status" size="large" class="m-2" placeholder="Select" @change="onStatusChange">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
  <el-table v-model:current-page="data.req.page" :data="data.taskList" stripe style="width: 100%">
    <el-table-column prop="id" label="id" width="180" />
    <el-table-column prop="name" label="作业名" width="180" />
    <el-table-column prop="src_type" label="前端" />
    <el-table-column prop="dst_type" label="后端" />
    <el-table-column prop="last_heartbeat" label="心跳">
      <template #default="scope">
        <div>{{ tsFormat(scope.row.last_heartbeat) }}</div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <div v-if="scope.row.status == 2">
          <el-button size="small" @click="stopTask(scope.row)">
            <span>⏸</span>
          </el-button>
        </div>
        <div v-else>
          <el-button size="small" @click="startTask(scope.row)">
            <span>🐔</span>
          </el-button>
          <el-button size="small" @click="modifyTask(scope.row)">
            <span>修改</span>
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div class="example-pagination-block">
    <el-pagination :page-size="10" layout="prev, pager, next" :total="data.count" @current-change="currentChange" />
  </div>
</template>
<script lang="ts" setup>
import { tsFormat, countTask, fetchTaskList, newTaskListRequest, startTaskBackend, stopTaskBackend, TaskInfo, TaskListRequest, fetchTask } from "./types";

import { onMounted, reactive, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { router } from "@/routers/router";

let data = reactive<{
  taskList: TaskInfo[];
  req: TaskListRequest;
  count: number;
}>({
  taskList: [],
  count: 0,
  req: newTaskListRequest(1, 0, 10),
});

//
onMounted(() => {
  fetchTaskList(data.req.status, data.req.page, data.req.page_size).then((taskList) => {
    data.taskList = taskList;
  });
  countTask(data.req.status).then((count) => {
    console.log("count == ", count);
    data.count = count;
  });
});

const startTask = (task: TaskInfo) => {
  console.log("stop task ", task, toRaw(data.taskList));
  startTaskBackend(task.id).then((res) => {
    if (res.err_no == 10000) {
      for (let i = 0; i < data.taskList.length; i++) {
        if (data.taskList[i].id === task.id) {
          data.taskList.splice(i, 1);
          break;
        }
      }
    }
  });
};

const stopTask = (task: TaskInfo) => {
  console.log("stop task ", task, toRaw(data.taskList));
  stopTaskBackend(task.id).then((res) => {
    console.log("cancel task ", res);
    if (res.err_no != 10000) {
      console.error("error ", res.err_msg);
      ElMessage({ message: res.err_msg, type: "warning" });
      return;
    }
    ElMessage({ message: "success", type: "success" });
    // 处理正常的逻辑
    for (let i = 0; i < data.taskList.length; i++) {
      if (data.taskList[i].id === task.id) {
        data.taskList.splice(i, 1);
        break;
      }
    }
  });
};

const modifyTask = (task: TaskInfo) => {
  console.log("modify task ", task);
  fetchTask(task.id.toString()).then((res: TaskInfo) => {
    console.log("task ", res);
  });
  // this.$router.
  router.replace("/debug?id=" + task.id.toString());
  // this.$router()
};
const currentChange = (currPage: number) => {
  console.log("page ..... ", currPage);
  data.req.page = currPage - 1; //
  fetchTaskList(data.req.status, data.req.page, data.req.page_size).then((taskList) => {
    data.taskList = taskList;
  });
};

const options = [
  {
    value: 1,
    label: "创建",
  },
  {
    value: 2,
    label: "运行中",
  },
  {
    value: 3,
    label: "取消",
  },
  {
    value: 4,
    label: "错误",
  },
  {
    value: 5,
    label: "删除",
  },
];
const onStatusChange = (status: number) => {
  console.log("status change ", status);
  data.req.status = status;
  data.req.page = 0;

  fetchTaskList(data.req.status, data.req.page, data.req.page_size).then((taskList) => {
    data.taskList = taskList;
  });
  countTask(data.req.status).then((count) => {
    console.log("count == ", count);
    data.count = count;
  });
};
</script>
<style lang="css" scoped>
/* css */
</style>
