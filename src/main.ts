import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import axios from 'axios'

axios.defaults.baseURL="http://127.0.0.1:8080"
axios.defaults.withCredentials = true

createApp(App).use(ElementPlus).mount('#app')
