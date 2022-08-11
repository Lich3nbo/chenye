import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import axios from 'axios'

axios.interceptors.request.use((config) => {
  store.commit('setError', { status: false })
  store.commit('setLoading', true)
  return config
})

axios.interceptors.response.use((config) => {
  setTimeout(() => {
    store.commit('setLoading', false)
  }, 3000)
  return config
}, (err) => {
  console.log(err)
  const { error } = err.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
