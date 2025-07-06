<template>
  <div class="app min-h-screen bg-zinc-950 text-white">
    <nav class="navbar flex items-center justify-between px-8 py-4 bg-zinc-900 shadow-md">
      <h1 class="text-2xl font-bold tracking-wide">Wilkloud</h1>
      <div class="nav-links flex gap-6">
        <router-link
          to="/"
          class="nav-link text-zinc-300 hover:text-white transition-colors px-3 py-1 rounded-lg"
          active-class="bg-zinc-800 text-white font-semibold shadow"
        >
          Dashboard
        </router-link>
        <router-link
          to="/shows"
          class="nav-link text-zinc-300 hover:text-white transition-colors px-3 py-1 rounded-lg"
          active-class="bg-zinc-800 text-white font-semibold shadow"
        >
          All Shows
        </router-link>
        <router-link
          to="/movies"
          class="nav-link text-zinc-300 hover:text-white transition-colors px-3 py-1 rounded-lg"
          active-class="bg-zinc-800 text-white font-semibold shadow"
        >
          All Movies
        </router-link>
      </div>
    </nav>

    <div class="px-4 py-4">
      <router-view />
    </div>
  </div>
</template>

