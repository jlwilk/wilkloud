const apiHost = window.location.hostname
let apiUrl = import.meta.env.VITE_API_URL

if (apiHost === 'localhost' || apiHost === '127.0.0.1') {
  apiUrl = import.meta.env.VITE_API_LOCAL_URL || 'http://localhost:8000'
}

export default apiUrl
