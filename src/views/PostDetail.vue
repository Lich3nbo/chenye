<template>
  <div class="post-detail-page">
    <article class="w-75 mx-auto pb-3" v-if="currentPost">
      <img class="rounded img-fluid my-4" :src="currentPost.image.url" :alt="currentPost.title" />
      <h2 class="my-1">{{ currentPost.title }}</h2>
      <div class="user-profile-component border-top border-bottom py-3 mb-5 align-items-center row g-0">
        <div class="col">
          <user-profile :user="currentPost.author" v-if="typeof currentPost === 'object'"></user-profile>
        </div>
        <span class="text-muted col text-end fst-italic">
          {{ currentPost.createdAt }}
        </span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import UserProfile from '../components/UserProfile.vue'
import { GLobalDataProps, PostProps } from '../store'

export default defineComponent({
  name: 'PostPage',
  components: {
    UserProfile
  },
  setup () {
    const store = useStore<GLobalDataProps>()
    const route = useRoute()
    const currentId = route.params.id
    console.log('%c 🥤 currentId: ', 'font-size:20px;background-color: #7F2B82;color:#fff;', currentId)
    onMounted(() => {
      store.dispatch('fetchPost', currentId)
    })
    const currentPost = computed(() => store.state.post)
    return {
      currentPost
    }
  }
})
</script>

<style>

</style>
