<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

onMounted(() => {
  fetchShows()
})
</script>

<template>
  <div class="max-w-screen-2xl mx-auto px-8 py-16">
    <div class="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-8 mb-8">
      <div
        v-for="show in shows"
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
          <h3 class="text-base font-semibold truncate">{{ show.title }}</h3>
          <p class="mt-2 text-sm text-zinc-400">
            {{ show.year }} • {{ show.network }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
