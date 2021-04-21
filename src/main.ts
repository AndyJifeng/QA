import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入css
import 'ant-design-vue/dist/antd.css';
// 引入Antd配置文件
import ant from './plugins/Ant'

const app = createApp(App)
app.use(ant)
app.use(store)
app.use(router)
app.mount('#app')
