<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiUrl from '@utils/api'

const route = useRoute()
const router = useRouter()

type Show = {
  id: number
  title: string
  year: number
  network: string
  certification: string
  overview: string
  images?: Array<{ coverType: string; remoteUrl: string }>
  seasons: Array<{
    seasonNumber: number
    statistics: {
      episodeCount: number
      sizeOnDisk: number
    }
  }>
}

const selectedShow = ref<Show | null>(null)

async function fetchShowDetails() {
  const showRes = await fetch(`${apiUrl}/show/${route.params.showId}`)
  const showData = await showRes.json()
  console.log(showData)
  selectedShow.value = showData
}

onMounted(() => {
  fetchShowDetails()
})

</script>

<template>
  <div v-if="selectedShow" class="show-details">
    <div class="show-header">
      <img v-if="selectedShow?.images" :src="selectedShow.images.find(img => img.coverType === 'poster')?.remoteUrl"
        :alt="selectedShow.title" />
      class="show-background" />
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
      <div v-for="season in selectedShow.seasons.filter(s => s.seasonNumber > 0)" :key="season.seasonNumber"
        class="season-section">
        <div class="season-header">
          <h3>Season {{ season.seasonNumber }}</h3>
          <div class="season-stats">
            <span>{{ season.statistics.episodeCount }} Episodes</span>
          </div>
          <button @click="router.push(`/show/${selectedShow.id}/season/${season.seasonNumber}`)">
            View Season
          </button>
        </div>
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
