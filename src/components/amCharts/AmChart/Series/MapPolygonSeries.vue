<template>
  <div class="map-polygon-series"></div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, SetupContext, watch } from '@vue/composition-api'
import { MapPolygonSeries } from '@amcharts/amcharts4/maps'
import { useSeries, seriesProps } from '../composables'
import { IDictionary } from 'common-types'
import { IChart, ChartType } from '../index'
import { color } from '@amcharts/amcharts4/core'

const DEFAULT_COLOR = 'rgb(217,217,217)'

export default defineComponent({
  name: 'MapPolygonSeries',
  props: {
    ...seriesProps,
    exclude: {
      type: Array,
      default: () => ['AQ'],
    },
    hoverFill: {
      type: String,
    },
  },

  setup(props: IDictionary, context: SetupContext) {
    const series: Ref<MapPolygonSeries> = ref(new MapPolygonSeries())
    const { actionsConfig, register, onChartConfig, initializeProps, childReady, dataReady } = useSeries(
      props,
      context,
      series,
    )
    dataReady(series.value)

    register(ChartType.series, props.id, MapPolygonSeries, series)

    actionsConfig(s => ({
      name: s,
      tooltipText: [s, 'mapPolygons.template.tooltipText', v => v, () => s.invalidateData()],
      show: () => {
        if (props.show) {
          s.show()
          s.invalidate()
        } else {
          s.hide()
          s.invalidate()
        }
      },
      exclude: s,
      fill: [s, 'mapPolygons.template.fill', v => color(v ?? DEFAULT_COLOR), () => s.invalidateData()],
    }))

    onChartConfig((chart: IChart) => {
      initializeProps()
      series.value.useGeodata = true
      const hs = series.value.mapPolygons.template.states.create('hover')

      // add-hoc watcher for hover state fill
      watch(
        () => props.hoverFill,
        () => {
          hs.properties.fill = color(props.hoverFill ?? DEFAULT_COLOR)
          series.value.invalidateData()
        },
      )

      series.value = chart.series.push(series.value)
    })

    childReady()

    return { series }
  },
})
</script>

<style scoped>
.map-polygon-series {
  opacity: 1;
}
</style>
