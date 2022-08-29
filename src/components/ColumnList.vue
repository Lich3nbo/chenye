<template>
  <div class="row">
    <div v-for="column in columnList" :key="column._id" class="col-4 mb-4" >
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <!-- boder-light 颜色  w-25宽度百分之25 my-y方向的 margin -->
          <img :src="column.avatar && column.avatar.fitUrl" class="rounded-circle border border-light w-25 my-3" :alt="column.title">
          <h5 class="card-title">{{column.title}}</h5>
          <p class="card-text text-left">{{column.description}}</p>
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { ColumnProps } from '../store'
import { gennerateFitUrl } from '../helper'

export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        gennerateFitUrl(column, 100, 100)
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>

<style>

</style>
