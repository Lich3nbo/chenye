import { createRouter, createWebHashHistory } from 'vue-router'
import store from './store'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import SignUp from './views/SignUp.vue'

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
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({
      name: 'login'
    })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next('/')
  } else {
    next()
  }
})

export default router
