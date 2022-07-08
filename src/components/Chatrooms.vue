<template>
  <h1>Chatroom List</h1>
  <div style="display:flex; align-items:center; flex-direction:column">
    <el-table :data="tableData" style="width: 70%">
    <el-table-column label="Chatroom ID" prop="id" />
    <el-table-column label="Manager" prop="username" />
    <el-table-column label="Creation DateTime" prop="creation_time" />
    <el-table-column align="right">
    <template #header>
        <el-button size="small" type="primary" @click="newChatroom()">Add new chatroom</el-button>
    </template>
    <template #default="scope">
      <el-button size="small" type="primary" plain @click="$emit('enter_chatroom', scope.row.id)">Enter</el-button>
      <el-button size="small" type="danger" plain @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
      </el-table-column>
    </el-table>
    <div style="min-height: 30px;"></div>
    <el-affix position="bottom" :offset="20" style="width: 68%;">
        <el-input
          v-model="text"
          maxlength="50"
          placeholder="To enter custom chatromm, input chatroom_id and press ENTER."
          show-word-limit
          type="text"
          @keyup.enter.native="inputHandler"
        />
      </el-affix>
  </div>
</template>

<script lang="ts" setup>
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { isInteger } from 'lodash';
import { onMounted, reactive, ref } from 'vue'

const emit = defineEmits(['enter_chatroom'])
const text = ref("")

interface ChatroomInfo {
  id: number
  username?: string
  creation_time: string
}

const props = defineProps<{
  username: string
}>()

const inputHandler = () => {
  if(isNaN(parseInt(text.value))) {
    ElMessage({
      showClose: true,
      message: "输入有误",
      type: 'error',
    })
    return
  }
  emit("enter_chatroom", parseInt(text.value))
  text.value = ""
}

const handleDelete = (index: number, row: ChatroomInfo) => {
  axios.post("/chatroom/delete", {
    "chatroom_id": row.id
  }).then((resp) => {
    if(resp.data.code==200) {
      ElMessage({
        showClose: true,
        message: resp.data.msg,
        type: 'success',
      })
      tableData.splice(index, 1)
    } else {
      ElMessage({
        showClose: true,
        message: resp.data.msg,
        type: 'error',
      })
    }
  })
}

const newChatroom = () => {
  axios.post("/chatroom/create").then((resp) => {
    if(resp.data.code==200) {
      console.log(resp.data)
      tableData.push({
        username: props.username,
        id: resp.data.chatroom_id,
        creation_time: new Date(resp.data.create_time*1000).toLocaleString()
      })
      ElMessage({
        showClose: true,
        message: resp.data.msg,
        type: 'success',
      })
    } else {
      ElMessage({
        showClose: true,
        message: resp.data.msg,
        type: 'error',
      })
    }
  }).catch((err) => {
    console.log(err)
    ElMessage({
      showClose: true,
      message: err.response.data.msg,
      type: 'error',
    })
  })
}

var tableData = reactive<ChatroomInfo[]>([
  {
    id: 0,
    username: "------",
    creation_time: "000000000"
  }
])

onMounted(() => {
  console.log(tableData)

  axios.get("/chatroom/my").then((resp) => {
    if(resp.data.code==200) {
      while(tableData.length>0) tableData.pop()
      for(let chatroom of resp.data.chatrooms) {
        tableData.push({
          username: props.username,
          id: chatroom._id,
          creation_time: new Date(chatroom.create_time*1000).toLocaleString()
        })
      }
    } else {
      ElMessage({
        showClose: true,
        message: resp.data.msg,
        type: 'error',
      })
    }
  }).catch((err) => {
    console.log(err)
    ElMessage({
      showClose: true,
      message: err.response.data.msg,
      type: 'error',
    })
  })
})
</script>