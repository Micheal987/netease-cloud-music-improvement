import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import './plugins/element'
import "./assets/style/base.less";
import "./assets/style/normalize.css";

// 使用图片懒加载
Vue.use(VueLazyload,{
  loading: require('./assets/image/placeholder.png')
})
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')