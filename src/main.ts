import Vue from "vue"
import App from "./App.vue"
import AppRouter from "./Router"
import vuetify from "./Plugins/vuetify"

Vue.use(vuetify)

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
