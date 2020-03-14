<template>
  <div class="chart-cursor"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useRegistry } from '@/components/amCharts/AmChart/composables'
import { ChartType, IChart } from '@/components/amCharts/AmChart'
import { Cursor } from '@amcharts/amcharts4/charts'

export default defineComponent({
  name: 'ChartCursor',

  setup(props: IDictionary, context: SetupContext) {
    const { register } = useRegistry(props, context, Cursor)
    const cursor: Ref<Cursor> = ref(new Cursor())

    const configure = async (chart: IChart) => {
      chart.cursor = cursor.value
    }

    register(ChartType.cursor, 'cursor', configure)

    return { ChartCursor: Cursor, cursor }
  },
})
</script>

<style scoped>
.chart-cursor {
  opacity: 1;
}
</style>
