import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.use(vuetify)

Vue.config.productionTip = false
declare global {
  interface Window { moment: any; }
}
window.moment =  require('moment')

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
