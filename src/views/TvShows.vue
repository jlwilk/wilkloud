<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiUrl from '@utils/api'
import "tailwindcss"

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
  <div class="relative w-full px-2 py-8 flex justify-center">
    <!-- Alphabet Sidebar (right side, tall links) -->
    <div class="hidden md:flex flex-col items-center fixed right-2 top-1/2 -translate-y-1/2 z-10 h-[80vh] justify-between">
      <a
        v-for="letter in alphabet"
        :key="letter"
        :href="`#letter-${letter}`"
        class="text-zinc-400 hover:text-white text-xs font-bold py-2 px-3 rounded transition flex items-center justify-center h-full"
        style="min-height:2.2rem;"
      >
        {{ letter }}
      </a>
    </div>
    <!-- Shows Grid -->
    <div class="w-full max-w-screen-2xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8 mb-8">
      <template v-for="letter in alphabet" :key="letter">
        <template v-if="showsByLetter[letter] && showsByLetter[letter].length">
          <div :id="`letter-${letter}`" class="col-span-full">
            <div class="sr-only">{{ letter }}</div>
          </div>
          <div
            v-for="show in showsByLetter[letter]"
            :key="show.id"
            class="bg-zinc-800 rounded-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            @click="selectShow(show.id)"
          >
            <img
              :src="show.images?.find(img => img.coverType === 'poster')?.remoteUrl"
              :alt="show.title"
              class="w-full aspect-[2/3] object-cover"
            />
            <div class="p-4">
              <h3 class="text-base font-semibold break-words">{{ show.title }}</h3>
              <p class="mt-2 text-sm text-zinc-400 truncate">
                {{ show.year }} • {{ show.network }}
              </p>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
