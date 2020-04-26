import Vue from "vue"
import App from "./App.vue"
import AppRouter from "./Router"
import vuetify from "./Plugins/vuetify"
import Notifications from 'vue-notification'

Vue.use(vuetify)
Vue.use(Notifications)

Vue.config.productionTip = false
declare global {
    interface Window {
        moment: any
    }
}

const router = AppRouter
new Vue({
    router,
    vuetify,
    render: (h) => h(App),
}).$mount("#app")
