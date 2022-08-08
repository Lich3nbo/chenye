import axios from 'axios'
import { Commit, createStore } from 'vuex'

interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: number;
  columnId?: number;
}

interface ImageProps {
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

export interface GLobalDataProps {
  loading: boolean;
  columns: ColumnProps[];
  posts: PostProps[]
  user: UserProps
}

const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
}

const store = createStore<GLobalDataProps>({
  state: {
    loading: false,
    columns: [],
    posts: [],
    user: { isLogin: true, name: 'chenye', id: 3, columnId: 1 }
  },
  mutations: {
    login (state) {
      state.user = { ...state.user, isLogin: true, name: 'chenye' }
    },
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
    }
  },
  actions: {
    async fetchColumns ({ commit }) {
      getAndCommit('/api/columns?currentPage=1&pageSize=5', 'fetchColumns', commit)
    },
    async fetchColumn ({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}`, 'fetchColum', commit)
    },
    async fetchPosts ({ commit }, cid) {
      getAndCommit(`/api/columns/${cid}/posts?currentPage=1&pageSize=5`, 'fetchPosts', commit)
    }
  },
  getters: {
    getColumnById: (state) => (id: string) => state.columns.find(c => c._id === id),
    getPostsByCid: (state) => (cId: string) => state.posts.filter(post => post.column === cId)
  }
})

export default store
