import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainScreen from '../components/MainScreen/MainScreen.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: MainScreen
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
