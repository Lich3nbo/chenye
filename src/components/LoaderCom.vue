<template>
  <teleport to="#back">
    <div
      class="d-flex justify-content-center align-items-center h-100 loading-container"
      :style="{ backgroundColor: background || '' }"
    >
      <div class="loading-content text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{text || 'Loading...'}}</span>
        </div>
        <p v-if="text" class="text-primary small">{{text}}</p>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '../hooks/useDOMCreate'
export default defineComponent({
  props: {
    text: {
      type: String,
      default: ''
    },
    background: {
      type: String
    }
  },
  setup () {
    useDOMCreate('back')
  }
})
</script>

<style>
.loading-container{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background: rgba(255, 255, 255, .5);
  width: 100%;
  height: 100%;
}
</style>
