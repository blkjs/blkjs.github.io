// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible/flexible';//引入rem
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';//样式文件一定要引入
Vue.use(ElementUI);


import axios from 'axios'
axios.defaults.withCredentials=true;
Vue.prototype.$http= axios

  import 'url-search-params-polyfill'//解决ie无法请求数据问题
  import 'babel-polyfill'//解决ie无法请求数据问题



Vue.config.productionTip = false

import Public from '@/components/Public/Public'
Vue.prototype.Public = Public
//调用的时候通过this.Public.方法名

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
