import axios from 'axios'

export const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// Ensure Authorization header is always attached from localStorage token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any)['Authorization'] = `Bearer ${token}`
  }
  return config
})

