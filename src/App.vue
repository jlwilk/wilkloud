<template>
  <div>
    <h1>Wilkloud Media Player</h1>

    <div class="tabs">
      <button :class="{ active: activeTab === 'movies' }" @click="activeTab = 'movies'">
        Movies
      </button>
      <button :class="{ active: activeTab === 'tv' }" @click="activeTab = 'tv'">
        TV Shows
      </button>
    </div>

    <div v-if="activeTab === 'movies'" class="content">
      <h2>Movies</h2>
      <ul>
        <li v-for="movie in movies" :key="movie.id">
          <button @click="playMedia('movie', movie.id)">
            {{ movie.title }}
          </button>
        </li>
      </ul>
    </div>

    <div v-if="activeTab === 'tv'" class="content">
      <h2>TV Shows</h2>
      <ul>
        <li v-for="show in tvShows" :key="show.id">
          <button @click="playMedia('tv', show.id)">
            {{ show.title }} (Season {{ show.season }})
          </button>
        </li>
      </ul>
    </div>

    <div v-if="currentMediaUrl" class="player">
      <h2>Now Playing</h2>
      <video controls width="720">
        <source :src="currentMediaUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL
const movies = ref([])
const tvShows = ref([])
const currentMediaUrl = ref('')
const activeTab = ref('movies')

async function fetchMovies() {
  const res = await fetch(`${apiUrl}/movies`)
  movies.value = await res.json()
}

async function fetchTVShows() {
  const res = await fetch(`${apiUrl}/tv-shows`)
  tvShows.value = await res.json()
}

function playMedia(type, id) {
  currentMediaUrl.value = `${apiUrl}/media/${type}/${id}`
}

onMounted(() => {
  fetchMovies()
  fetchTVShows()
})
</script>

<style>
body {
  font-family: sans-serif;
  text-align: center;
}

.tabs {
  margin: 20px 0;
}

.tabs button {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
}

.tabs button.active {
  background: #007bff;
  color: white;
}

ul {
  list-style: none;
  padding: 0;
}

button {
  margin: 5px;
  padding: 10px;
}

.content {
  margin: 20px 0;
}

.player {
  margin-top: 20px;
}

video {
  margin-top: 20px;
}
</style>
