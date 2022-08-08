<template>
  <div class="create-post-container">
    <h3>新建文章</h3>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题</label>
        <validate-input
          v-model="titleVal"
          :rules="titleRules"
          placeholder="请输入文章标题"
          type="text">
        </validate-input>
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情</label>
        <validate-input
          rows="10"
          v-model="contentVal"
          :rules="contentRules"
          placeholder="请输入文章详情"
          type="text"
          tag="textarea">
        </validate-input>
      </div>
      <template #submit>
        <button class="btn btn-primary">发表文章</button>
      </template>
    </validate-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { GLobalDataProps } from '../store'
import { PostProps } from '../testData'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput
  },
  setup () {
    const store = useStore<GLobalDataProps>()
    const router = useRouter()
    const titleVal = ref('')
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { columnId } = store.state.user
        if (!columnId) { return }
        const newPost: PostProps = {
          id: new Date().getTime(),
          title: titleVal.value,
          content: contentVal.value,
          createdAt: new Date().toLocaleString(),
          columnId
        }
        store.commit('createPost', newPost)
        router.push({ name: 'column', params: { id: columnId } })
      }
    }
    return {
      titleVal,
      contentVal,
      titleRules,
      contentRules,
      onFormSubmit
    }
  }
})
</script>

<style>

</style>
