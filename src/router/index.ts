import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainScreen from '../components/MainScreen/MainScreen.vue'
import Screensaver from "../components/Screensaver/Screensaver.vue"

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
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
