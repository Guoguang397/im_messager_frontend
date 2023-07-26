<template>
  <div style="display:flex; justify-content:center;">
    <div class="container">
      <h1>Chatroom #{{props.chatroom_id}}</h1>
      <div class="content_area">
        <div v-for="message in messages" :key="message.time">
          <div class="left time" v-if="message.type==1">{{message.time}}</div>
          <div class="left bold" v-if="message.type==1">{{message.message}}</div>

          <div class="center" v-if="message.type==2">{{message.message}}</div>

          <div class="right time" v-if="message.type==3">{{message.time}}</div>
          <div class="right bold" v-if="message.type==3">{{message.message}}</div>
        </div>
      </div>
      <el-affix position="bottom" :offset="20">
        <el-input
          v-model="text"
          maxlength="50"
          placeholder="Input message. (Input /back or /home to return.)"
          show-word-limit
          type="text"
          @keyup.enter.native="sendHandler"
        />
      </el-affix>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 80%;
  flex-direction: column;
}

.content_area {
  min-height: 500px;
  text-align: left;
  line-height: 1.7em;
}

.left {
  text-align: left;
}

.center {
  text-align: center;
  color: gray;
}

.right {
  text-align: right;
}

.bold {
  font-weight: bold;
}
.time {
  line-height: 6px;
  font-size: small;
  margin-top: 10px;
}
</style>

<script lang="ts" setup>
  import axios from 'axios';
  import { ElMessage } from 'element-plus';
  import { onMounted, onUnmounted, reactive, ref } from 'vue'
  const props = defineProps<{
    chatroom_id: number,
    username: string
  }>()

  const historyLine = "- - - - - - - - - - - - - - - - - History - - - - - - - - - - - - - - - - -"

  interface Message {
    message: string,
    time: string,
    type: number
  }

  const messages = reactive<Message[]>([
    // {message: historyLine, time: "", type: 2},
    // {message: "socket connected.", time: "", type: 2},
    // {message: "Guoguang: Hello~", time: "2022-07-07 18:05:16", type: 1},
    // {message: "My message.", time: "2022-07-07 18:05:16", type: 3},
    // {message: "Lemon: Anybody here?", time: "2022-07-07 18:05:16", type: 1},
    // {message: "Apple: Test message.", time: "2022-07-07 18:05:16", type: 1}
  ])
  const text = ref('')
  const socketOpened = ref(false)
  const sendHandler = (event: KeyboardEvent) => {
    if(text.value == "/back" || text.value == "/home") {
      emit("back")
      return
    } else if (text.value.startsWith("/")) {
      ElMessage({
        showClose: true,
        message: "未找到指令",
        type: 'warning',
      })
      return
    }
    if(text.value=="") {
      ElMessage({
        showClose: true,
        message: "请输入消息",
        type: 'error',
      })
    }
    sendMessage(text.value)
    text.value = ""
    console.log(event)
  }

  const emit = defineEmits(['back'])

  onMounted(() => {
    axios.get("/chatroom/history?chatroom_id=" + props.chatroom_id).then((resp) => {
      console.log(resp.data)
      for(let msg of resp.data.messages) {
        if(msg.sender == props.username) {
          messages.push({
            message: msg.message,
            time: new Date(msg.send_time*1000).toLocaleString(),
            type: 3
          })
        } else {
          messages.push({
            message: msg.sender + ": " + msg.message,
            time: new Date(msg.send_time*1000).toLocaleString(),
            type: 1
          })
        }
      }
      messages.push({
        message: historyLine,
        time: "",
        type: 2
      })
    })
    socketOpened.value = true
    openSocket()
  })

  onUnmounted(() => {
    console.log("on_unmounted")
    socketOpened.value = false
    socket.close()
  })

  // Websocket callback
  const socket_onopen = (arg: Event) => {
    messages.push({
      message: "Websoket connected.",
      time: "",
      type: 2
    })
    ElMessage({
      showClose: true,
      message: "连接成功",
      type: 'success',
    })
  }
  const socket_onclose = (arg: Event) => {
    console.log("on_close")
    socketOpened.value = false
    messages.push({
      message: "Websoket closed.",
      time: "",
      type: 2
    })
    ElMessage({
      showClose: true,
      message: "连接断开",
      type: 'warning',
    })
  }
  const socket_onerror = (arg: Event) => {
    console.log("on_error")
    if(!socketOpened.value) {
      return
    }
    messages.push({
      message: "Websoket error.",
      time: "",
      type: 2
    })
    ElMessage({
      showClose: true,
      message: "房间号不存在或已被删除",
      type: 'error',
    })
    emit("back")
  }
  const socket_onmessage = (arg: MessageEvent) => {
    console.log(arg)
    let resp = JSON.parse(arg.data)
    if(resp.code == 200) {
      let msg = resp.messages[0]
      if(msg.sender == props.username) {
        messages.push({
          message: msg.message,
          time: new Date(msg.send_time*1000).toLocaleString(),
          type: 3
        })
      } else {
        messages.push({
          message: msg.sender + ": " + msg.message,
          time: new Date(msg.send_time*1000).toLocaleString(),
          type: 1
        })
      }
    }
  }

  // Websocket

  var socket: WebSocket = new WebSocket("ws://127.0.0.1:8001/ws?username="+props.username+"&chatroom_id="+props.chatroom_id)
  const openSocket = () => {
    socket.onopen = socket_onopen
    socket.onclose = socket_onclose
    socket.onerror = socket_onerror
    socket.onmessage = socket_onmessage
  }
  const sendMessage = (msg: string) => {
    socket.send(JSON.stringify({
      message: msg
    }))
  }
</script>