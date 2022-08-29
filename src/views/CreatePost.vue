<template>
  <div class="create-post-container">
    <h3>新建文章</h3>
    <up-loader
      action="/api/upload"
      :beforeUploader="uploadCheck"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w100 my-4"
    >
      <h2>点击上传头图</h2>
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <template #uploaded="slotProps">
        <img :src="slotProps.uploadedData.data.url" alt="">
      </template>
    </up-loader>
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
import axios from 'axios'
import { GLobalDataProps, PostProps } from '../store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import UpLoader from '../components/UpLoader.vue'
import { beforeUploadCheck } from '../helper'
import createMessage from '@/components/createMessage'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    UpLoader
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
        const { column } = store.state.user
        if (!column) { return }
        const newPost: PostProps = {
          _id: new Date().getTime() + '',
          title: titleVal.value,
          content: contentVal.value,
          createdAt: new Date().toLocaleString(),
          column
        }
        store.commit('createPost', newPost)
        router.push({ name: 'column', params: { id: column } })
      }
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadFile = files[0]
        const formData = new FormData()
        formData.append(uploadFile.name, uploadFile)
        axios.post('/api/upload', formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then(res => {
          console.log('%c 🥪 res: ', 'font-size:20px;background-color: #93C0A4;color:#fff;', res)
        })
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/png', 'image/jpeg'], size: 2 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是 JPG/PNG 格式', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过 2 M', 'error')
      }
      return passed
    }
    return {
      titleVal,
      contentVal,
      titleRules,
      contentRules,
      onFormSubmit,
      handleFileChange,
      uploadCheck
    }
  }
})
</script>

<style>
.create-post-container .file-upload-container{
  width: 100%;
  height: 200px;
  cursor: pointer;
}
.create-post-container .file-upload-container img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
