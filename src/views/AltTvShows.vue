<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
alphabet.unshift('#')

const showsByLetter = computed(() => {
  const grouped: Record<string, Show[]> = {}
  for (const letter of alphabet) grouped[letter] = []
  for (const show of shows.value) {
    const firstChar = show.title.replace(/^The /i, '').charAt(0).toUpperCase()
    if (/\d/.test(firstChar)) {
      grouped['#'].push(show)
    } else if (grouped[firstChar]) {
      grouped[firstChar].push(show)
    }
  }
  return grouped
})

onMounted(() => {
  fetchShows()
})
</script>

<template>
  <div>
    <div class="shows-container">
      <!-- Alphabet Sidebar (right side, tall links) -->
      <div class="alphabet-sidebar">
        <a
          v-for="letter in alphabet"
          :key="letter"
          :href="`#letter-${letter}`"
          class="alphabet-link"
          style="min-height:2.2rem;"
        >
          {{ letter }}
        </a>
      </div>
      <!-- Shows Grid -->
      <div class="shows-grid">
        <template v-for="letter in alphabet" :key="letter">
          <template v-if="showsByLetter[letter] && showsByLetter[letter].length">
            <div :id="`letter-${letter}`" class="letter-anchor">
              <div class="sr-only">{{ letter }}</div>
            </div>
            <div
              v-for="show in showsByLetter[letter]"
              :key="show.id"
              class="show-card"
              @click="selectShow(show.id)"
            >
              <img
                :src="show.images?.find(img => img.coverType === 'poster')?.remoteUrl"
                :alt="show.title"
                class="show-image"
              />
              <div class="show-info">
                <h3 class="show-title">{{ show.title }}</h3>
                <p class="show-meta">
                  {{ show.year }} • {{ show.network }}
                </p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.css-warning {
  background: #b91c1c;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: bold;
}

.shows-container {
  position: relative;
  width: 100%;
  padding: 2rem 0.5rem;
  display: flex;
  justify-content: center;
}

.alphabet-sidebar {
  display: none;
}
@media (min-width: 768px) {
  .alphabet-sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    height: 80vh;
    justify-content: space-between;
  }
}

.alphabet-link {
  color: #a1a1aa;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-decoration: none;
}
.alphabet-link:hover {
  color: #fff;
}

.shows-grid {
  width: 100%;
  max-width: 1536px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}
@media (min-width: 640px) {
  .shows-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (min-width: 768px) {
  .shows-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (min-width: 1024px) {
  .shows-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
@media (min-width: 1280px) {
  .shows-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

.letter-anchor {
  grid-column: 1 / -1;
}

.show-card {
  background: #27272a;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}
.show-card:hover {
  transform: scale(1.05);
}

.show-image {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
}

.show-info {
  padding: 1rem;
}

.show-title {
  font-size: 1rem;
  font-weight: 600;
  word-break: break-word;
}

.show-meta {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #a1a1aa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
</style>
