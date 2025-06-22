<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiUrl from '@utils/api'

// It's best practice to move these to a shared `types.ts` file
interface Show {
  id: string
  title: string
}

interface Episode {
  id: string
  episode: number
  title: string
  season: number
  overview?: string
}

const route = useRoute()
const router = useRouter()

// Reactive state
const show = ref<Show | null>(null)
const episode = ref<Episode | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed properties for robust route param handling
const showId = computed(() => {
  const param = route.params.showId
  return Array.isArray(param) ? param[0] : param
})

const seasonNumber = computed(() => {
  const param = route.params.seasonNumber
  const num = parseInt(Array.isArray(param) ? param[0] : param, 10)
  return isNaN(num) ? null : num
})

const episodeNumber = computed(() => {
  const param = route.params.episodeId
  const num = parseInt(Array.isArray(param) ? param[0] : param, 10)
  return isNaN(num) ? null : num
})

// Computed property for the video stream URL
const videoUrl = computed(() => {
  if (!showId.value || seasonNumber.value === null || episodeNumber.value === null) {
    return ''
  }
  return `${apiUrl}/stream/${showId.value}/${seasonNumber.value}/${episodeNumber.value}`
})

async function fetchEpisodeDetails() {
  isLoading.value = true
  error.value = null

  if (!showId.value || seasonNumber.value === null || episodeNumber.value === null) {
    error.value = 'Invalid URL parameters.'
    isLoading.value = false
    return
  }

  try {
    const [showRes, episodesRes] = await Promise.all([
      fetch(`${apiUrl}/show/${showId.value}`),
      fetch(`${apiUrl}/show/${showId.value}/episodes`)
    ])

    if (!showRes.ok || !episodesRes.ok) {
      throw new Error('Failed to fetch episode details.')
    }

    const showData: Show = await showRes.json()
    const episodesData: Episode[] = await episodesRes.json()

    show.value = showData
    episode.value = episodesData.find(ep => ep.season === seasonNumber.value && ep.episode === episodeNumber.value) ?? null

    if (!episode.value) {
      throw new Error(`Episode S${seasonNumber.value}E${episodeNumber.value} not found.`)
    }

  } catch (e: unknown) {
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = 'An unknown error occurred.'
    }
    console.error('Error fetching episode details:', e)
  } finally {
    isLoading.value = false
  }
}

// Function to navigate back to the season view
function goBackToSeason() {
  if (showId.value && seasonNumber.value !== null) {
    router.push(`/show/${showId.value}/season/${seasonNumber.value}`)
  } else {
    router.push('/shows') // Fallback
  }
}

// Fetch data when the component is mounted
onMounted(() => {
  fetchEpisodeDetails()
})
</script>

<template>
  <div class="player-page">
    <div v-if="isLoading" class="loading-state">
      <p>Loading player...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button @click="goBackToSeason">Go Back</button>
    </div>

    <div v-else-if="show && episode" class="player-content">
      <div class="player-header">
        <div class="title-info">
          <h1>{{ show.title }}</h1>
          <h2>S{{ String(seasonNumber).padStart(2, '0') }}E{{ String(episodeNumber).padStart(2, '0') }}: {{ episode.title }}</h2>
        </div>
        <button @click="goBackToSeason" class="back-button">← Back to Season</button>
      </div>

      <div class="video-container">
        <video
          class="video-player"
          :src="videoUrl"
          controls
          autoplay
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div v-if="episode.overview" class="episode-overview">
        <p>{{ episode.overview }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.player-page {
  padding: 2rem;
  margin-top: 4rem; /* Account for fixed navbar */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 4rem);
}

.loading-state, .error-state {
  text-align: center;
  margin-top: 10vh;
}

.error-state button {
  margin-top: 1rem;
}

.player-content {
  width: 100%;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.title-info h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.title-info h2 {
  margin: 0.25rem 0 0;
  font-size: 1.2rem;
  color: #ccc;
  font-weight: 400;
}

.back-button {
  background: #333;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: #444;
}

.video-container {
  width: 100%;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.video-player {
  width: 100%;
  aspect-ratio: 16/9;
  display: block;
}

.episode-overview {
  background: #1f1f1f;
  padding: 1.5rem;
  border-radius: 8px;
  color: #ddd;
  line-height: 1.6;
}
</style>
