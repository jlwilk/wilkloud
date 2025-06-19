<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL
const selectedShow = ref(null)
const currentMediaUrl = ref('')
const videoPlayer = ref(null)

async function fetchShowDetails() {
  const showRes = await fetch(`${apiUrl}/show/${route.params.id}`)
  const showData = await showRes.json()
  selectedShow.value = showData
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
  fetchShowDetails()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="selectedShow" class="show-details">
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
          <button @click="router.push('/shows')">← Back to Shows</button>
        </div>
      </div>
    </div>

    <div class="seasons">
      <div 
        v-for="season in selectedShow.seasons.filter(s => s.seasonNumber > 0)" 
        :key="season.seasonNumber"
        class="season-section"
      >
        <div class="season-header">
          <h3>Season {{ season.seasonNumber }}</h3>
          <div class="season-stats">
            <span>{{ season.statistics.episodeCount }} Episodes</span>
            <span>{{ (season.statistics.sizeOnDisk / 1024 / 1024 / 1024).toFixed(1) }} GB</span>
          </div>
          <button @click="router.push(`/show/${selectedShow.id}/season/${season.seasonNumber}`)">
            View Season
          </button>
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

<style scoped>
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
  background: #2f2f2f;
  border-radius: 8px;
  padding: 1.5rem;
}

.season-header {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.season-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.season-stats {
  color: #999;
  font-size: 0.9rem;
}

.season-stats span {
  margin-right: 1rem;
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