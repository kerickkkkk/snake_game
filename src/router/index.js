import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/snake',
  //   name: 'SnakeGame',
  //   component: () => import(/* webpackChunkName: "snake" */ '@/components/SnakeGame.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
