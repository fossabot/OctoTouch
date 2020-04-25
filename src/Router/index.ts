import Vue from "vue"
// eslint-disable-next-line no-unused-vars
import VueRouter, { RouteConfig } from "vue-router"
import MainScreen from "../Views/MainScreen/MainScreen.vue"
import NowPrinting from "../Views/NowPrinting/NowPrinting.vue"
import Control from "../Views/Control/Control.vue"
import Files from "../Views/Files/Files.vue"
import Utilities from "../Views/Utilities/Utilities.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home",
        component: MainScreen
    },
    {
        path: "/now-printing",
        name: "NowPrinting",
        component: NowPrinting
    },
    {
        path: "/control",
        name: "Control",
        component: Control
    },
    {
        path: "/files",
        name: "Files",
        component: Files
    },
    {
        path: "/utilities",
        name: "Utilities",
        component: Utilities
    }
]

const AppRouter = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
})

export default AppRouter
