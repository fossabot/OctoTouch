import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2';
//import * as moment from "moment";
// If you don't need the styles, do not connect
 
Vue.use(VueSweetalert2);
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
