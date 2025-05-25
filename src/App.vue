<template>
  <div>
    <h1>Wilkloud Media Player</h1>
    <div class="show-grid">
      <div class="show-card" v-for="show in shows" :key="show.id">
        <img
          :src="show.images.find(img => img.coverType === 'poster')?.remoteUrl"
          alt="Poster"
          class="poster"
        />
        <h3>{{ show.title }} ({{ show.year }})</h3>
        <p><strong>Network:</strong> {{ show.network }}</p>
        <p><strong>Rating:</strong> {{ show.ratings.value }}/10</p>
        <p>{{ show.overview }}</p>
        <button @click="playEpisode(show.id)">▶ Play First Episode</button>
      </div>
    </div>

    <div v-if="currentMovieUrl">
      <h2>Now Playing</h2>
      <video ref="videoPlayer" controls>
        <source :src="currentMovieUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style="margin-top: 10px;">
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

async function fetchShows() {
  const res = await fetch(`${apiUrl}/shows`)
  shows.value = await res.json()
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

.show-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.show-card {
  width: 240px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: left;
  background-color: #f9f9f9;
}

.poster {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

button {
  margin: 5px;
  padding: 10px;
}

video {
  display: block;
  width: 100%;
  height: auto;
  margin-top: 20px;
}
</style>
