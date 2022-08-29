import axios from 'axios'
import { Commit, createStore } from 'vuex'

export interface ResponseType<P> {
  code: number;
  msg: string;
  data:P;
}

export interface UserProps {
  isLogin: boolean;
  nickName?: string;
  _id?: string;
  column?: string;
  email?: string;
}

export interface ImageProps {
  _id?: string,
  url?: string,
  createdAt?: string
}

export interface ColumnProps {
  _id: string;
  title: string;
  description: string;
  avatar?: ImageProps;
}

export interface PostProps {
  _id: string;
  title: string;
  content?: string;
  image?: ImageProps;
  excerpt?: string;
  createdAt: string;
  column: string;
}

export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GLobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[]
  user: UserProps
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data // 含有data参数的Promise
}

const store = createStore<GLobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: false }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns (state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn (state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts (state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    logout (state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns ({ commit }) {
      getAndCommit('/api/columns?currentPage=1&pageSize=5', 'fetchColumns', commit)
    },
    fetchColumn ({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColum', commit)
    },
    fetchPosts ({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}/posts?currentPage=1&pageSize=5`, 'fetchPosts', commit)
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payload) {
      return postAndCommit('/api/user/login', 'login', commit, payload)
    },
    loginAndFetch ({ commit, dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => state.columns.find(c => c._id === id),
    getPostsByCid: (state) => (cId: string) => state.posts.filter(post => post.column === cId)
  }
})

export default store
