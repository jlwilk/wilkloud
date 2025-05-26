<template>
  <div>
    <h1>Wilkloud Media Player</h1>

    <div class="pagination">
      <button 
        :disabled="currentPage <= 1" 
        @click="changePage(currentPage - 1)"
      >
        ← Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button 
        :disabled="currentPage >= totalPages" 
        @click="changePage(currentPage + 1)"
      >
        Next →
      </button>
    </div>

    <div class="show-grid">
      <div class="show-card" v-for="show in shows" :key="show.id">
        <img
          :src="show.images.find(img => img.coverType === 'poster')?.remoteUrl"
          :alt="show.title"
          class="poster"
        />
        <div class="show-info">
          <h3>{{ show.title }} ({{ show.year }})</h3>
          <p class="genres">{{ show.genres.join(' • ') }}</p>
          <p><strong>Network:</strong> {{ show.network }}</p>
          <p><strong>Rating:</strong> {{ show.ratings.value }}/10 ({{ show.ratings.votes }} votes)</p>
          <p><strong>Runtime:</strong> {{ show.runtime }} minutes</p>
          <p><strong>Status:</strong> {{ show.status }}</p>
          <p><strong>Certification:</strong> {{ show.certification }}</p>
          <p class="overview">{{ show.overview }}</p>
          <div class="show-actions">
            <button @click="playEpisode(show.id)">▶ Play First Episode</button>
            <button @click="showDetails(show)">ℹ️ Show Details</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentMovieUrl" class="player">
      <h2>Now Playing</h2>
      <video ref="videoPlayer" controls>
        <source :src="currentMovieUrl" type="video/mp4" />
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
const currentMovieUrl = ref('')
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

async function changePage(page) {
  await fetchShows(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function playEpisode(seriesId) {
  const res = await fetch(`${apiUrl}/shows/${seriesId}/episodes`)
  const episodes = await res.json()
  if (episodes.length > 0) {
    currentMovieUrl.value = `${apiUrl}/episodes/${episodes[0].episodeFileId}`
  } else {
    alert("No playable episodes found.")
  }
}

function showDetails(show) {
  // TODO: Implement show details modal or page
  console.log('Show details:', show)
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
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style>
body {
  font-family: sans-serif;
  text-align: center;
}

.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.pagination button {
  padding: 8px 16px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.show-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  max-width: 5120px;
  margin: 0 auto;
}

.show-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f9f9f9;
  transition: transform 0.2s;
  max-width: 320px;
  margin: 0 auto;
}

.show-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.poster {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.show-info {
  padding: 15px;
  text-align: left;
}

.show-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
}

.genres {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.overview {
  margin: 10px 0;
  font-size: 0.9em;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.show-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.show-actions button {
  flex: 1;
  padding: 8px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

.show-actions button:hover {
  background: #0056b3;
}

.player {
  margin: 20px auto;
  max-width: 800px;
  padding: 20px;
}

.player-controls {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

video {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

button {
  cursor: pointer;
}
</style>
