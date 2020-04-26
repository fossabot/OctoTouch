import Vue from "vue"
// eslint-disable-next-line no-unused-vars
import VueRouter, { RouteConfig } from "vue-router"

//Import views
import MainScreen from "@/Views/MainScreen/MainScreen.vue"
import NowPrinting from "@/Views/NowPrinting/NowPrinting.vue"
import Control from "@/Views/Control/Control.vue"
import Files from "@/Views/Files/Files.vue"
import Utilities from "@/Views/Utilities/Utilities.vue"
import Screensaver from "@/Views/Screensaver/Screensaver.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "Home Screen",
        component: MainScreen,
    },
    {
        path: "/now-printing",
        name: "Currently Printing",
        component: NowPrinting,
    },
    {
        path: "/control",
        name: "Control Interface",
        component: Control,
    },
    {
        path: "/files",
        name: "Files List",
        component: Files,
    },
    {
        path: "/utilities",
        name: "Utilities Menu",
        component: Utilities,
    },
    {
        path: "/asleep",
        name: "Printer Disconnected",
        component: Screensaver
    }
]

const AppRouter = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
})

export default AppRouter
