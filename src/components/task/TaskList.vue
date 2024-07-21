<template>
  <el-select v-model="data.req.status" @change="onCurrentStatusChange">
    <el-option v-for="(item, index) in StatusList" :key="index" :label="item.display_value"
      :value="item.value"></el-option>
  </el-select>
  <el-table v-model:current_page="data.req.page" :data="data.task_list">
    <el-table-column prop="id" label="id" width="180"></el-table-column>
    <el-table-column prop="name" label="name" width="180"></el-table-column>
    <el-table-column prop="status" label="status" width="240">
      <template #default="scope">
        <span v-if="scope.row.status === StatusStop || scope.row.status === StatusCreated">stop</span>
        <span v-else-if="scope.row.status == StatusRunning">
          running
        </span>
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column prop="handle_num" label="handle_num" width="180"></el-table-column>
    <el-table-column prop="handle_err" label="handle_err" width="180"></el-table-column>
    <el-table-column prop="created_at" label="created_at" width="180">
      <template #default="scope">
        {{ $dayjs.unix(scope.row.created_at).fromNow() }}
      </template>
    </el-table-column>
    <el-table-column prop="updated_at" label="updated_at" width="180">
      <template #default="scope">
        {{ scope.row.updated_at != 0 ? $dayjs.unix(scope.row.updated_at).fromNow() : '-' }}
      </template>
    </el-table-column>
    <el-table-column prop="heartbeat" label="heartbeat" width="180">
      <template #default="scope">

        {{ scope.row.heartbeat !== 0 ? $dayjs.unix(scope.row.heartbeat).fromNow() : "-" }}
      </template>
    </el-table-column>
    <el-table-column label="start/stop">
      <template #default="scope">
        <span v-if="scope.row.status === StatusRunning" @click="stopTask(scope.row.id)">stop</span>
        <span
          v-else-if="scope.row.status === StatusCreated || scope.row.status === StatusStop || scope.row.status === StatusError"
          @click="startJob(scope.row.id)">start</span>

        <span v-else>-</span>
      </template>
    </el-table-column>

    <el-table-column label="op" width="180">
      <template #default="scope">
        <span v-if="scope.row.status === StatusRunning">-</span>
        <span
          v-else-if="scope.row.status === StatusStop || scope.row.status === StatusCreated || scope.row.status === StatusError"
          @click="modifyTask(scope.row.id)">modify</span>
        <span v-else>-</span>
      </template>
    </el-table-column>
  </el-table>
  <div class="example-pagination-block">
    <el-pagination :page-size="data.req.page_size" :total="data.task_count" @current-change="onCurrentPageChange"
      layout="total, sizes, prev, pager, next" :page-sizes="[10, 20, 50, 100]" @size-change="onSizeChange" />
  </div>
</template>
<script setup lang="ts">
import { reactive, onMounted, getCurrentInstance } from "vue";
import { get, post } from '@/api/request';
import { FetchTaskListRequest, PAGE_SIZE, StatusCreated, StatusError, StatusList, StatusRunning, StatusStop, TaskInfo, TaskStatusCountRequest, TaskStatusCountResponse } from "./types";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const { appContext } = getCurrentInstance()!;
const router = useRouter();
console.log('hello');

const data = reactive<{
  req: FetchTaskListRequest,
  task_list: TaskInfo[],
  task_count: number,
}>({
  req: <FetchTaskListRequest>{
    status: 0,
    page_size: PAGE_SIZE,
    page: 1,
  },
  task_list: [],
  task_count: 0
})
onMounted(() => {
  fetch_task_status_count(data.req.status);
  fetch_task_list(data.req);
})
const fetch_task_status_count = (status: number) => {
  //
  get<TaskStatusCountResponse>("/task/count", { status }).then(res => {
    console.log(res.data);
    data.task_count = res.data;
  })

}

// 60 秒刷新一次页面
let ticker = setInterval(() => {
  fetch_task_list(data.req);
}, 60 * 1000);

const fetch_task_list = (req: FetchTaskListRequest) => {
  get<TaskInfo[]>("/task/list", req).then(res => {
    console.log(res.data)
    if (res.err_no === 10000) {
      data.task_list = res.data
    } else {
      ElMessage({ message: res.err_msg, type: 'error' }, appContext)
    }
  })
}

console.log("new page");
const onCurrentPageChange = (currentPage: number) => {
  data.req.page = currentPage;
  fetch_task_list(data.req)
};

const onCurrentStatusChange = (status: number) => {
  console.log('change status')
  data.req.status = status;
  fetch_task_status_count(data.req.status);
  fetch_task_list(data.req)

}
const onSizeChange = (value: number) => {
  console.log("size change ", value);
  data.req.page_size = value;
  data.req.page = 1;
  fetch_task_list(data.req)

}
const startJob = (id: number) => {
  console.log("start....", id);
  post(`/task/start/${id}`).then(res => {
    console.log(res);
    fetch_task_list(data.req);
  })
}

const modifyTask = (id: number) => {
  console.log('modify ', id);
  router.push({ path: "/config", query: { id: id } })
}

const stopTask = (id: number) => {
  console.log("stop task ", id)
  post(`/task/stop/${id}`).then(res => {
    console.log("stop success", res);
    fetch_task_list(data.req)
  });
};
</script>
<style lang="css" scoped></style>
