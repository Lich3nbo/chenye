import { createRouter, createWebHashHistory } from 'vue-router'
import store from './store'
import axios from 'axios'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import SignUp from './views/SignUp.vue'
import PostDetail from './views/PostDetail.vue'

const routerHistory = createWebHashHistory()

const router = createRouter({
  history: routerHistory,
  routes: [
    { path: '/', name: 'home', component: Home },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { redirectAlreadyLogin: true }
    },
    { path: '/column/:id', name: 'column', component: ColumnDetail },
    { path: '/posts/:id', name: 'posts', component: PostDetail },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: { requiredLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('%c 🍧 to: ', 'font-size:20px;background-color: #6EC1C2;color:#fff;', to.meta)
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta

  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(res => {
        console.log('%c 🍠 res: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', res)
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(err => {
        console.error(err)
        store.commit('logout')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('/login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
