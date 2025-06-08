<template>
  <div class="app">
    <nav class="navbar">
      <h1>Wilkloud</h1>
      <div class="nav-links">
        <router-link 
          to="/"
          class="nav-link"
          active-class="active"
        >
          Dashboard
        </router-link>
        <router-link 
          to="/shows"
          class="nav-link"
          active-class="active"
        >
          All Shows
        </router-link>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background: #141414;
  color: white;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #e50914;
}

.nav-links {
  margin-left: 2rem;
}

.nav-link {
  background: none;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
}

.nav-link.active {
  color: #e50914;
}
</style>
