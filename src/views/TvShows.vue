<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiUrl from '@utils/api'

const router = useRouter()
const shows = ref<Show[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = ref(20)

interface Show {
  id: number
  title: string
  year: number
  network: string
  images?: {
    coverType: string;
    remoteUrl: string;
  }[];
}

async function fetchShows() {
  const res = await fetch(`${apiUrl}/shows?page=${currentPage.value}&pageSize=${pageSize.value}`)
  const data = await res.json()
  shows.value = data.results
  totalPages.value = Math.ceil(data.total / pageSize.value)
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

    <div class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--; fetchShows()"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++; fetchShows()"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped>
.shows {
  padding: 2rem;
  padding-top: 4rem;
}

.shows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  background: #e50914;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.pagination button:disabled {
  background: #666;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background: #f40612;
}

.pagination span {
  color: #999;
}
</style>
