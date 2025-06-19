import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Shows from '../views/Shows.vue'
import Show from '../views/Show.vue'
import Season from '../views/Season.vue'
import FilePlayer from '../views/FilePlayer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/shows',
      name: 'shows',
      component: Shows
    },
    {
      path: '/show/:id',
      name: 'show',
      component: Show
    },
    {
      path: '/show/:id/season/:seasonNumber',
      name: 'season',
      component: Season
    },
    {
      path: '/show/:showId/season/:seasonNumber/file/:fileId',
      name: 'file-player',
      component: FilePlayer
    }
  ]
})

export default router
