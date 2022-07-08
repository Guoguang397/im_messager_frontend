<script lang="ts" setup>
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

  import Home from './components/Home.vue'
  import { reactive, ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  import Chatrooms from './components/Chatrooms.vue'
  import Chatroom from './components/Chatroom.vue'

  const logined = ref(false)
  const chatroom_entered = ref(false)
  const chatroom_id = ref(-1)
  var username = ref("")

  type FormData =  {
    password: string,
    username: string
  }

  const doLogin = function(data: FormData) {
    if(data.username && data.password.length>=6&&data.password.length<=20) {
      axios.post("/user/login", data).then((resp) => {
        console.log(resp.data)
        if(resp.data.code==200) {
          username.value = data.username
          logined.value = true
          ElMessage({
            showClose: true,
            message: resp.data.msg,
            type: 'success',
          })
        } else {
          logined.value = false
          ElMessage({
            showClose: true,
            message: resp.data.msg,
            type: 'error',
          })
        }
      })
    }
  }
  const enterChatroom = function(cid: number) {
    chatroom_id.value = cid
    chatroom_entered.value = true
  }

</script>

<template>
  <div>
    <Home v-if="!logined" @doLogin="doLogin"/>
    <Chatrooms v-else-if="!chatroom_entered" :username="username" @enter_chatroom="enterChatroom"></Chatrooms>
    <Chatroom v-else :chatroom_id="chatroom_id" :username="username" @back="chatroom_entered=false"></Chatroom>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>