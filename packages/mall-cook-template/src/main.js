/*
 * @Description: What's this for
 * @Autor: WangYuan
 * @Date: 2022-01-08 11:04:13
 * @LastEditors: purl
 * @LastEditTime: 2022-07-23 16:59:02
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import configURL from './utils/config.js'

// 注册全局样式
import '@/scss/index.scss'
// 注册公用渲染方法
import '@/utils/registerBaseStyle.js'
// 注册全局过滤器
import '@/utils/filters.js'

import jump from '@/utils/globalJump'
Vue.prototype.$jump = jump
Vue.prototype.$toast = (title, cb) => {
  if(!title) throw new Error('title不能为空');
  return uni.showToast({
    title,
    icon: 'none',
    success: () => {
      cb && 'function' === typeof cb && cb();
    }
  })
}
const msg = (title, duration=1500, mask=false, icon='none')=>{
  //统一提示方便全局修改
  if(Boolean(title) === false){
    return;
  }
  uni.showToast({
    title,
    duration,
    mask,
    icon
  });
}
const prePage = ()=>{
  let pages = getCurrentPages();
  let prePage = pages[pages.length - 2];
  // #ifdef H5
  return prePage;
  // #endif
  return prePage.$vm;
}
// uview组件库
import uView from 'uview-ui'
Vue.use(uView)
uni.$u.config.unit = 'rpx'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.prototype.configURL = configURL
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, prePage};
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
