//全局配置rem
require('./utils/rem.js')

//element UI组件库
//1.全局引入=》整个组件库引入=》项目体积加大
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' //样式引用
Vue.use(ElementUI) //使插件合法使用




import Vue from 'vue'


import VueRouter from 'vue-router'
Vue.use(VueRouter)
import routers from './router'
const router = new VueRouter(routers);

import App from './App.vue'
import store from './store'
import './registerServiceWorker'
import axios from 'axios'
Vue.prototype.$http = axios //全局注册



Vue.config.productionTip = false

import './assets/js/font.js';

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')