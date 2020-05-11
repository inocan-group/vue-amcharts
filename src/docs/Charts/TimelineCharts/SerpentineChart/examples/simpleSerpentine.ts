import { SerpentineChart, CurveStepLineSeries, ValueAxis, DateAxis } from '@/components'
import { select, number, boolean } from '@storybook/addon-knobs'
import { serpentineDataset } from '../dataset'

type ISerpentineChart = import('@amcharts/amcharts4/plugins/timeline').SerpentineChart

export const simpleSerpentine = () => ({
  data: () => ({ dataset: serpentineDataset }),
  props: {
    orientation: {
      default: select('chart orientation', { vertical: 'vertical', horizontal: 'horizontal' }, 'vertical', 'Component'),
    },
    levelCount: {
      default: number('number of turns (levelCount)', 5, { min: 0 }, 'Component'),
    },
    disableAxisLine: {
      default: boolean('disable x axis line', true, 'Component'),
    },
    radius: {
      default: number('y axis radius', 50, { min: 0 }, 'Component'),
    },
    innerRadius: {
      default: number('y axis inner radius', -50, { min: 0 }, 'Component'),
    },
  },
  components: { SerpentineChart, CurveStepLineSeries, ValueAxis, DateAxis },
  methods: {
    initChart(chart: ISerpentineChart) {
      chart.padding(20, 20, 20, 20)
    },
  },
  template: `
    <div style="width: 100%; height: 300px">
        <serpentine-chart :data="dataset" :orientation="orientation" :level-count="levelCount" :initialize="initChart" >
            <curve-step-line-series x-prop="date" y-prop="value" :fill-opacity="0.3" :stroke-width="2" />
            <value-axis dimension="y" :inner-radius="innerRadius" :radius="radius" :disable-tooltip="true" />
            <date-axis dimension="x" :disable-axis-line="disableAxisLine" :min-zoom-count="5" />
        </serpentine-chart>
    </div>
  `,
})
