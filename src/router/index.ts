import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainScreen from '../components/MainScreen/MainScreen.vue'
import Screensaver from "../components/Screensaver/Screensaver.vue"
import NowPrinting from "../components/NowPrinting/NowPrinting.vue"

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
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
