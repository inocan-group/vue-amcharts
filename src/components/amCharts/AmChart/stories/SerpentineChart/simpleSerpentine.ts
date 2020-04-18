import { SerpentineChart, CurveStepLineSeries, ValueAxis, DateAxis, ChartCursor } from '../../index'
import { select, number, boolean } from '@storybook/addon-knobs'

const dataset: { date: Date; value: number }[] = []
let visits = 100

for (let i = 0; i < 24; i++) {
  visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10)
  dataset.push({ date: new Date(2018, 0, 1, i), value: visits })
}

export const simpleSerpentine = () => ({
  data: () => ({ dataset }),
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
  components: { SerpentineChart, CurveStepLineSeries, ValueAxis, DateAxis, ChartCursor },
  template: `
    <div style="width: 100%; height: 300px">
        <serpentine-chart :data="dataset" :orientation="orientation" :level-count="levelCount" ref="serpentineChart">
            <curve-step-line-series x-prop="date" y-prop="value" :fill-opacity="0.3" :stroke-width="2" />
            <value-axis dimension="y" :inner-radius="innerRadius" :radius="radius" :disable-tooltip="true" />
            <date-axis dimension="x" :disable-axis-line="disableAxisLine" :min-zoom-count="5" />
            <!-- TODO: Get cursor to show up -->
            <chart-cursor />
        </serpentine-chart>
    </div>
  `,
  mounted() {
    this.$refs.serpentineChart.chart.padding(20, 20, 20, 20)
  },
})
