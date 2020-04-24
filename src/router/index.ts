import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainScreen from '../components/MainScreen/MainScreen.vue'
import NowPrinting from "../components/NowPrinting/NowPrinting.vue"
import Control from "../components/Control/Control.vue"
import Files from "../components/Files/Files.vue"
import Utilities from "../components/Utilities/Utilities.vue"

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
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

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
