<template>
  <div class="file-player">
    <div class="player-container">
      <video
        ref="videoPlayer"
        class="video-player"
        controls
        :src="fileUrl"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
      >
        Your browser does not support the video tag.
      </video>
      
      <div class="file-info">
        <h2>{{ fileName }}</h2>
        <div class="metadata">
          <span class="duration">Duration: {{ formatDuration(duration) }}</span>
          <span class="progress">Progress: {{ formatDuration(currentTime) }} / {{ formatDuration(duration) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const videoPlayer = ref<HTMLVideoElement | null>(null)
const currentTime = ref(0)
const duration = ref(0)
const fileName = ref('')

// In a real implementation, this would come from your API
const fileUrl = computed(() => {
  // This is a placeholder - you'll need to implement the actual file URL generation
  return `/api/files/${route.params.fileId}/stream`
})

onMounted(async () => {
  // Here you would typically:
  // 1. Fetch file metadata
  // 2. Set up the player
  // 3. Handle any authentication/authorization
  try {
    // Placeholder for file metadata fetch
    // const response = await fetch(`/api/files/${route.params.fileId}`)
    // const data = await response.json()
    // fileName.value = data.name
  } catch (error) {
    console.error('Error loading file:', error)
    // Handle error appropriately
  }
})

const onTimeUpdate = () => {
  if (videoPlayer.value) {
    currentTime.value = videoPlayer.value.currentTime
    duration.value = videoPlayer.value.duration
  }
}

const onEnded = () => {
  // Handle video end - maybe auto-play next file or show completion message
  console.log('Playback ended')
}

const formatDuration = (seconds: number) => {
  if (!seconds) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.file-player {
  padding: 2rem;
  margin-top: 4rem; /* Account for fixed navbar */
  min-height: calc(100vh - 4rem);
  background: #141414;
}

.player-container {
  max-width: 1200px;
  margin: 0 auto;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-player {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
}

.file-info {
  padding: 1.5rem;
  color: white;
}

.file-info h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
}

.metadata {
  display: flex;
  gap: 2rem;
  color: #999;
  font-size: 0.9rem;
}

.duration, .progress {
  display: flex;
  align-items: center;
}
</style> 