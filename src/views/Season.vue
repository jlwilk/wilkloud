<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL
const show = ref(null)
const season = ref(null)
const episodes = ref(null)
const currentMediaUrl = ref('')
const videoPlayer = ref(null)

async function fetchShowAndSeason() {
  const showRes = await fetch(`${apiUrl}/show/${route.params.id}`)
  const showData = await showRes.json()
  show.value = showData
  
  // Get the specific season
  season.value = show.value.seasons.find(s => s.seasonNumber === parseInt(route.params.seasonNumber))
  
  // Fetch episodes for this season
  const episodesRes = await fetch(`${apiUrl}/show/${route.params.id}/episodes`)
  const episodesData = await episodesRes.json()
  episodes.value = episodesData.filter(ep => ep.season === parseInt(route.params.seasonNumber))
}

async function playEpisode(episodeId) {
  router.push(`/show/${route.params.id}/season/${route.params.seasonNumber}/file/${episodeId}`)
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
  fetchShowAndSeason()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="show && season" class="season-details">
    <div class="season-header">
      <img 
        :src="show.images?.find(img => img.coverType === 'fanart')?.remoteUrl" 
        :alt="show.title"
        class="season-background"
      />
      <div class="season-header-content">
        <h2>{{ show.title }} - Season {{ season.seasonNumber }}</h2>
        <div class="season-stats">
          <span>{{ season.statistics.episodeCount }} Episodes</span>
          <span>{{ (season.statistics.sizeOnDisk / 1024 / 1024 / 1024).toFixed(1) }} GB</span>
        </div>
        <div class="season-actions">
          <button @click="router.push(`/show/${show.id}`)">← Back to Show</button>
        </div>
      </div>
    </div>

    <div class="episodes-grid">
      <div 
        v-for="episode in episodes" 
        :key="episode.id"
        class="episode-card"
        @click="playEpisode(episode.episode)"
      >
        <img 
          :src="episode.stillPath || show.images?.find(img => img.coverType === 'poster')?.remoteUrl" 
          :alt="episode.title"
        />
        <div class="episode-info">
          <h4>Episode {{ episode.episode }}</h4>
          <p>Length: {{ episode.runtime }}</p>
          <p>{{ episode.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.season-details {
  padding-top: 4rem;
}

.season-header {
  position: relative;
  height: 40vh;
  overflow: hidden;
}

.season-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4);
}

.season-header-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  max-width: 800px;
}

.season-stats {
  color: #999;
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.season-stats span {
  margin-right: 1rem;
}

.episodes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 2rem;
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
</style> 