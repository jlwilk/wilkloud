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

function goBackToSeason() {
  if (showId.value && seasonNumber.value !== null) {
    router.push(`/show/${showId.value}/season/${seasonNumber.value}`)
  } else {
    router.push('/shows') // Fallback
  }
}

onMounted(() => {
  fetchEpisodeDetails()
})
</script>

<template>
  <div class="px-8 mt-16 flex justify-center items-start min-h-[calc(100vh-4rem)]">
    <div v-if="isLoading" class="text-center mt-[10vh]">
      <p>Loading player...</p>
    </div>

    <div v-else-if="error" class="text-center mt-[10vh]">
      <h2>Error</h2>
      <p>{{ error }}</p>
      <button @click="goBackToSeason" class="mt-4 bg-zinc-800 text-white px-6 py-3 rounded hover:bg-zinc-700">
        Go Back
      </button>
    </div>

    <div v-else-if="show && episode" class="w-full max-w-screen-xl flex flex-col gap-6">
      <div class="flex justify-between items-center flex-wrap gap-4">
        <div class="title-info">
          <h1 class="text-2xl font-semibold m-0">{{ show.title }}</h1>
          <h2 class="text-lg text-zinc-400 font-normal mt-1 m-0">S{{ String(seasonNumber).padStart(2, '0') }}E{{ String(episodeNumber).padStart(2, '0') }}: {{ episode.title }}</h2>
        </div>
        <button @click="goBackToSeason" class="bg-zinc-800 text-white px-6 py-3 rounded hover:bg-zinc-700 text-base">
          ← Back to Season
        </button>
      </div>

      <div class="w-full bg-black rounded-lg overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
        <video class="w-full aspect-video block" :src="videoUrl" controls autoplay>
          Your browser does not support the video tag.
        </video>
      </div>

      <div v-if="episode.overview" class="bg-zinc-900 text-zinc-300 p-6 rounded-lg leading-relaxed">
        <p>{{ episode.overview }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
