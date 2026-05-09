import { createApp, render } from 'vue'
import App from './App.vue'
//引入router
import router from '../router'
//引入插件
import ElementPlus from 'element-plus'
//引入css文件
import 'element-plus/theme-chalk/index.css';
import 'element-plus/dist/index.css'
//引入axios
import axios from 'axios'
//引入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
// 全局注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.provide('$axios', axios)
app.mount('#app')

//全局异常处理 给力
window.addEventListener('unhandledrejection', (event) => {
    console.log(event.reason);
  });
//app.config.globalProperties.$axios = axios//挂载到全局
