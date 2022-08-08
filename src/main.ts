import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'

axios.interceptors.request.use((config) => {
  store.commit('setLoading', true)
  return config
})

axios.interceptors.response.use((config) => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 3000)
  return config
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
