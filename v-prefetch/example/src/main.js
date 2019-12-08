import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VPrefetch from '../../dist/index'

Vue.config.productionTip = false
Vue.directive(VPrefetch.name, VPrefetch.getInstance({router}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
