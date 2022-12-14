<template>
  <div class="file-upload">
    <div
      class="file-upload-container"
      v-bind="$attrs"
      @click.prevent="triggerUpload">

      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传...</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
        <button class="btn btn-primary" disabled>上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input
      type="file"
      class="file-input d-none"
      ref="fileInput"
      @change="handleFileChange"
    >
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, PropType, ref } from 'vue'
type UploaderStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUploader: {
      type: Function as PropType<CheckFunction>
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error'],
  inheritAttrs: false,
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploaderStatus>('ready')
    const uploadedData = ref()
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        if (props.beforeUploader) {
          const result = props.beforeUploader(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-type': 'multipart/form-data'
          }
        }).then(res => {
          fileStatus.value = 'success'
          uploadedData.value = res.data
          context.emit('file-uploaded', res.data)
        }).catch(err => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', {
            err
          })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      uploadedData,
      handleFileChange
    }
  }
})
</script>

<style>

</style>
