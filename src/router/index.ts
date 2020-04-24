import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainScreen from '../Components/MainScreen/MainScreen.vue'
import Screensaver from "../Components/Screensaver/Screensaver.vue"
import NowPrinting from "../Components/NowPrinting/NowPrinting.vue"
import Control from "../Components/Control/Control.vue"
import Files from "../Components/Files/Files.vue"
import Utilities from "../Components/Utilities/Utilities.vue"

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: MainScreen
  },
  {
    path: "/asleep",
    name: "Screensaver",
    component: Screensaver
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

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
