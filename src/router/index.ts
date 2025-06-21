import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import TvShows from '../views/TvShows.vue'
import TvShow from '../views/TvShow.vue'
import TvSeason from '../views/TvSeason.vue'
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
      component: TvShows
    },
    {
      path: '/show/:showId',
      name: 'show',
      component: TvShow
    },
    {
      path: '/show/:showId/season/:seasonNumber',
      name: 'season',
      component: TvSeason
    },
    {
      path: '/show/:showId/season/:seasonNumber/episode/:episodeId',
      name: 'file-player',
      component: FilePlayer
    }
  ]
})

export default router
