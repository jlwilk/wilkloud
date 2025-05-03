<template>
  <div>
    <h1>Wilkloud Media Player</h1>
    <ul>
      <li v-for="movie in movies" :key="movie.id">
        <button @click="playMovie(movie.id)">
          {{ movie.title }}
        </button>
      </li>
    </ul>

    <div v-if="currentMovieUrl">
      <h2>Now Playing</h2>
      <video controls width="720">
        <source :src="currentMovieUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const apiUrl = import.meta.env.VITE_API_URL
const movies = ref([])
const currentMovieUrl = ref('')

async function fetchMovies() {
  const res = await fetch(`${apiUrl}/movies`)
  movies.value = await res.json()
}

function playMovie(id) {
  currentMovieUrl.value = `${apiUrl}/media/${id}`
}

onMounted(fetchMovies)
</script>

<style>
body {
  font-family: sans-serif;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

button {
  margin: 5px;
  padding: 10px;
}

video {
  margin-top: 20px;
}
</style>
