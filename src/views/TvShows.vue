<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiUrl from '@utils/api'

const router = useRouter()
const shows = ref<Show[]>([])

interface Show {
  id: number
  title: string
  year: number
  network: string
  images?: {
    coverType: string
    remoteUrl: string
  }[]
}

async function fetchShows() {
  const res = await fetch(`${apiUrl}/shows`)
  const data = await res.json()
  shows.value = data.sort((a: Show, b: Show) => {
    const titleA = a.title.replace(/^The /i, '')
    const titleB = b.title.replace(/^The /i, '')
    return titleA.localeCompare(titleB)
  })
}

function selectShow(showId: number) {
  router.push(`/show/${showId}`)
}

onMounted(() => {
  fetchShows()
})
</script>

<template>
  <div class="shows">
    <div class="shows-grid">
      <div
        v-for="show in shows"
        :key="show.id"
        class="show-card"
        @click="selectShow(show.id)"
      >
        <img
          :src="show.images?.find(img => img.coverType === 'poster')?.remoteUrl"
          :alt="show.title"
        />
        <div class="show-info">
          <h3>{{ show.title }}</h3>
          <p class="show-meta">
            {{ show.year }} • {{ show.network }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shows {
  /* Add max-width and auto margin for better viewing on ultra-wide screens */
  max-width: 1920px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 4rem;
}

.shows-grid {
  display: grid;
  /* This grid is already responsive. It will create as many 200px columns as can fit. */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.show-card {
  background: #2f2f2f;
  border-radius: 8px;
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
  padding: 1rem;
}

.show-info h3 {
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.show-meta {
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: #999;
}

/* For tablets and mobile phones, reduce padding and gaps for a better layout */
@media (max-width: 768px) {
  .shows {
    padding: 1rem;
    padding-top: 2rem;
  }
  .shows-grid {
    gap: 1rem;
  }
}
</style>
