<template>
  <div class="chart-cursor"></div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Cursor } from '@amcharts/amcharts4/charts'
import { useRegistry } from '../composables'
import { IDictionary } from 'common-types'

export default defineComponent({
  name: 'ChartCursor',

  setup(props: IDictionary, context) {
    const { register, getChild } = useRegistry(props, context, Cursor)

    return {}
  },
})
</script>

<style scoped>
.chart-cursor {
  opacity: 1;
}
</style>
