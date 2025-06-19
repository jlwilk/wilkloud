<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL
const recentlyAdded = ref([])

async function fetchRecentlyAdded() {
  const res = await fetch(`${apiUrl}/shows?page=1&page_size=7`)
  const data = await res.json()
  recentlyAdded.value = data.results
}

function selectShow(show) {
  router.push(`/show/${show.id}`)
}

onMounted(() => {
  fetchRecentlyAdded()
})
</script>

<template>
  <div class="dashboard">
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
</template>

<style scoped>
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
</style> 