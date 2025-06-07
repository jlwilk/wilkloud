<template>
  <div class="app">
    <nav class="navbar">
      <h1>Wilkloud</h1>
      <div class="nav-links">
        <button 
          :class="{ active: currentView === 'dashboard' }" 
          @click="currentView = 'dashboard'"
        >
          Dashboard
        </button>
        <button 
          :class="{ active: currentView === 'shows' }" 
          @click="currentView = 'shows'"
        >
          All Shows
        </button>
      </div>
    </nav>

    <!-- Dashboard View -->
    <div v-if="currentView === 'dashboard'" class="dashboard">
      <section class="hero">
        <div v-if="recentlyAdded.length > 0" class="hero-content">
          <img 
            :src="recentlyAdded[0].images.find(img => img.coverType === 'fanart')?.remoteUrl" 
            :alt="recentlyAdded[0].title"
            class="hero-background"
          />
          <div class="hero-info">
            <h2>{{ recentlyAdded[0].title }}</h2>
            <p>{{ recentlyAdded[0].overview }}</p>
            <button @click="selectShow(recentlyAdded[0])">▶ Play</button>
          </div>
        </div>
      </section>

      <section class="content-section">
        <h2>Recently Added</h2>
        <div class="show-row">
          <div 
            v-for="show in recentlyAdded.slice(1, 7)" 
            :key="show.id" 
            class="show-card"
            @click="selectShow(show)"
          >
            <img 
              :src="show.images.find(img => img.coverType === 'poster')?.remoteUrl" 
              :alt="show.title"
            />
            <div class="show-info">
              <h3>{{ show.title }}</h3>
              <p>{{ show.year }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- All Shows View -->
    <div v-else-if="currentView === 'shows'" class="shows-view">
      <div class="shows-grid">
        <div 
          v-for="show in shows" 
          :key="show.id" 
          class="show-card"
          @click="selectShow(show)"
        >
          <img 
            :src="show.images.find(img => img.coverType === 'poster')?.remoteUrl" 
            :alt="show.title"
          />
          <div class="show-info">
            <h3>{{ show.title }}</h3>
            <p>{{ show.year }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Show Details View -->
    <div v-else-if="currentView === 'show-details' && selectedShow" class="show-details">
      <div class="show-header">
        <img 
          :src="selectedShow.images?.find(img => img.coverType === 'fanart')?.remoteUrl" 
          :alt="selectedShow.title"
          class="show-background"
        />
        <div class="show-header-content">
          <h2>{{ selectedShow.title }}</h2>
          <p class="show-meta">
            {{ selectedShow.year }} • {{ selectedShow.network }} • {{ selectedShow.certification }}
          </p>
          <p class="show-overview">{{ selectedShow.overview }}</p>
          <div class="show-actions">
            <button @click="playFirstEpisode">▶ Play First Episode</button>
            <button @click="currentView = 'shows'">← Back to Shows</button>
          </div>
        </div>
      </div>

      <div class="seasons">
        <div 
          v-for="season in selectedShow.seasons.filter(s => s.seasonNumber > 0)" 
          :key="season.seasonNumber"
          class="season-section"
        >
          <h3>Season {{ season.seasonNumber }}</h3>
          <div class="episodes-grid">
            <div 
              v-for="episode in season.episodes" 
              :key="episode.id"
              class="episode-card"
              @click="playEpisode(episode.episodeFileId)"
            >
              <img 
                :src="episode.stillPath || selectedShow.images?.find(img => img.coverType === 'poster')?.remoteUrl" 
                :alt="episode.title"
              />
              <div class="episode-info">
                <h4>Episode {{ episode.episodeNumber }}</h4>
                <p>{{ episode.title }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Player -->
    <div v-if="currentMediaUrl" class="video-player">
      <div class="player-header">
        <h3>Now Playing</h3>
        <button @click="currentMediaUrl = null">✕</button>
      </div>
      <video ref="videoPlayer" controls>
        <source :src="currentMediaUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div class="player-controls">
        <button @click="skip(-10)">⏪ Back 10s</button>
        <button @click="skip(10)">⏩ Forward 10s</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL
const shows = ref([])
const recentlyAdded = ref([])
const currentView = ref('dashboard')
const selectedShow = ref(null)
const currentMediaUrl = ref('')
const videoPlayer = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 20

async function fetchShows(page = 1) {
  const res = await fetch(`${apiUrl}/shows?page=${page}&page_size=${pageSize}`)
  const data = await res.json()
  shows.value = data.results
  totalPages.value = data.total_pages
  currentPage.value = data.page
}

async function fetchRecentlyAdded() {
  const res = await fetch(`${apiUrl}/shows?page=1&page_size=7`)
  const data = await res.json()
  recentlyAdded.value = data.results
}

async function selectShow(show) {
  // First fetch the show details
  const showRes = await fetch(`${apiUrl}/shows/${show.id}`)
  const showData = await showRes.json()
  selectedShow.value = showData.results
  
  // Then fetch the episodes
  const episodesRes = await fetch(`${apiUrl}/shows/${show.id}/episodes`)
  const episodesData = await episodesRes.json()
  
  // Add episodes to their respective seasons
  if (selectedShow.value && selectedShow.value.seasons) {
    selectedShow.value.seasons = selectedShow.value.seasons.map(season => ({
      ...season,
      episodes: episodesData.filter(ep => ep.seasonNumber === season.seasonNumber)
    }))
  }
  
  currentView.value = 'show-details'
}

async function playFirstEpisode() {
  if (!selectedShow.value) return
  const res = await fetch(`${apiUrl}/shows/${selectedShow.value.id}/episodes`)
  const episodes = await res.json()
  if (episodes.length > 0) {
    currentMediaUrl.value = `${apiUrl}/episodes/${episodes[0].episodeFileId}`
  }
}

async function playEpisode(episodeId) {
  currentMediaUrl.value = `${apiUrl}/episodes/${episodeId}`
}

function skip(seconds) {
  if (videoPlayer.value) {
    videoPlayer.value.currentTime += seconds
  }
}

function handleKeydown(e) {
  if (!videoPlayer.value) return
  if (e.key === 'ArrowRight') {
    skip(10)
  } else if (e.key === 'ArrowLeft') {
    skip(-10)
  }
}

onMounted(() => {
  fetchShows()
  fetchRecentlyAdded()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style>
.app {
  min-height: 100vh;
  background: #141414;
  color: white;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #e50914;
}

.nav-links {
  margin-left: 2rem;
}

.nav-links button {
  background: none;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
}

.nav-links button.active {
  color: #e50914;
}

.dashboard {
  padding-top: 4rem;
}

.hero {
  position: relative;
  height: 60vh;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4);
}

.hero-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 2rem;
}

.hero-info {
  max-width: 600px;
}

.hero-info h2 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.content-section {
  padding: 2rem;
}

.show-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
}

.shows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 2rem;
  margin-top: 4rem;
}

.show-card {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.show-card:hover {
  transform: scale(1.05);
}

.show-card img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.show-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
}

.show-info h3 {
  margin: 0;
  font-size: 1rem;
}

.show-details {
  padding-top: 4rem;
}

.show-header {
  position: relative;
  height: 60vh;
  overflow: hidden;
}

.show-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4);
}

.show-header-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  max-width: 800px;
}

.show-meta {
  color: #999;
  margin: 0.5rem 0;
}

.show-overview {
  margin: 1rem 0;
}

.seasons {
  padding: 2rem;
}

.season-section {
  margin-bottom: 2rem;
}

.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.episode-card {
  display: flex;
  background: #2f2f2f;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.episode-card img {
  width: 160px;
  height: 90px;
  object-fit: cover;
}

.episode-info {
  padding: 1rem;
}

.episode-info h4 {
  margin: 0;
  font-size: 0.9rem;
}

.episode-info p {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: #999;
}

.video-player {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 400px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.8);
}

.player-header button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
}

button {
  background: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background: #f40612;
}

video {
  width: 100%;
  height: auto;
}
</style>
