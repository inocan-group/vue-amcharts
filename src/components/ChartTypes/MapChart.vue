<template>
  <div class="map-chart">
    <div class="chart" ref="chartdiv" />
    <slot />
  </div>
</template>

<script lang="ts">
import { MapChart } from '@amcharts/amcharts4/maps'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'
import { useTheme } from '@amcharts/amcharts4/core'
import { defineComponent, SetupContext } from '@vue/composition-api'
import { useChart } from '../composables'
import { IDictionary } from 'common-types'
import { IChildWithCardinality } from '../composables/useRegistry/registry-types'
import { projections } from '@amcharts/amcharts4/maps'

useTheme(am4themesAnimated)

type IProjection =
  | 'Albers'
  | 'AlbersUsa'
  | 'AzimuthalEqualArea'
  | 'Eckert6'
  | 'Projection'
  | 'Mercator'
  | 'Miller'
  | 'NaturalEarth1'
  | 'Orthographic'
  | 'Stereographic'

export default defineComponent({
  props: {
    projection: { type: String, default: 'Projection' },
    deltaLongitude: { type: Number, default: 0 },
    deltaLatitude: { type: Number, default: 0 },
    initialize: {
      type: Function,
    },
  },

  setup(props: IDictionary, context: SetupContext): IDictionary {
    const parentConfig: IChildWithCardinality[] = [
      [1, null, 'series'],
      [0, 1, 'legend'],
      [0, null, 'features'],
    ]
    const {
      chart,
      chartdiv,
      acceptChildMessage,
      acceptChildRegistration,
      registrants,
      dataMeta,
      chartData,
      actionsConfig,
      onChartMounted,
    } = useChart(MapChart, props, context, parentConfig)

    let _geoData: IDictionary = {}

    /**
     * **loadGeoData**
     *
     * The size of geo data can be large and therefore vue-amcharts does not load
     * data by default. You can use this method to provide data and typically this
     * should be either the low or high resolution data provided by [amCharts](https://www.amcharts.com/docs/v4/chart-types/map/)
     */
    function loadGeoData(data: IDictionary) {
      _geoData = data
    }

    actionsConfig(mc => ({
      projection: [mc, v => new projections[v as IProjection]()],
      deltaLongitude: mc,
      deltaLatitude: mc,
    }))

    onChartMounted(async chart => {
      // eslint-disable-next-line @typescript-eslint/camelcase
      chart.geodata = _geoData
    })

    return {
      chart,
      chartdiv,
      chartData,
      dataMeta,
      registrants,
      acceptChildRegistration,
      acceptChildMessage,
      loadGeoData,
    }
  },
})
</script>

<style scoped>
.map-chart {
  width: 100%;
  height: 800px;
}
.chart {
  width: 100%;
  height: 100%;
}
</style>
