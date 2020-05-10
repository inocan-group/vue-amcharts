import { SpiralChart, CurveColumnSeries, ValueAxis, CategoryAxis } from '@/components'
import { text, number, boolean } from '@storybook/addon-knobs'
import Vue from 'vue'

type ISpiralChart = import('@amcharts/amcharts4/plugins/timeline').SpiralChart
type ICurveColumnSeries = import('@amcharts/amcharts4/plugins/timeline').CurveColumnSeries

export const simpleSpiral = () =>
  Vue.extend({
    data: () => ({
      dataset: [
        { category: '' },
        { category: 'Chandler', value: 47 },
        { category: 'Joey', value: 45 },
        { category: 'Monica', value: 204 },
        { category: 'Phoebe', value: 62 },
        { category: 'Rachel', value: 154 },
        { category: 'Ross', value: 120 },
      ],
    }),
    props: {
      inversed: {
        default: boolean('inversed', true, 'Component'),
      },
      disableLabels: {
        default: boolean('disable labels', true, 'Component'),
      },
      levelCount: {
        default: number('number of turns (levelCount)', 3, { min: 0 }, 'Component'),
      },
      endAngle: {
        default: number('end angle', -135, {}, 'Component'),
      },
      radius: {
        default: number('radius', 80, { min: 0 }, 'Component'),
      },
      innerRadius: {
        default: number('inner radius', 0, { min: 0 }, 'Component'),
      },
      minGridDistance: {
        default: number('min grid distance', 70, { min: 0 }, 'Component'),
      },
      min: {
        default: number('min', 0, { min: 0 }, 'Component'),
      },
      axisStrokeOpacity: {
        default: number('stroke opacity', 0.5, { min: 0, max: 1, step: 0.1 }, 'Component'),
      },
      strokeDasharray: {
        default: text('stroke dash array', '1,4', 'Component'),
      },
      seriesStrokeOpacity: {
        default: number('column stroke opacity', 0.5, { min: 0, max: 1, step: 0.1 }, 'Component'),
      },
    },
    components: { SpiralChart, CurveColumnSeries, ValueAxis, CategoryAxis },
    mounted() {
      const { spiralChart, curveColumnSeries } = this.$refs
      ;(curveColumnSeries as Vue & { series: ICurveColumnSeries }).series.columns.template.adapter.add(
        'fill',
        (_, target) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return (spiralChart as Vue & { chart: ISpiralChart }).chart.colors.getIndex(target.dataItem!.index * 2)
        },
      )
    },
    template: `
    <div style="width: 100%; height: 300px">
        <spiral-chart :data="dataset" :inversed="inversed" :level-count="levelCount" :end-angle="endAngle" ref="spiralChart" >
          <curve-column-series :data="dataset" x-prop="value" y-prop="category" ref="curveColumnSeries" :stroke-opacity="seriesStrokeOpacity" />
          <value-axis dimension="x" :min="min" :disable-grid="true" :disable-labels="disableLabels" :min-grid-distance="minGridDistance" :stroke-opacity="axisStrokeOpacity" :stroke-dasharray="strokeDasharray" />
          <category-axis dimension="y" category="category" :disable-grid="true" :radius="radius" :inner-radius="innerRadius" />
        </spiral-chart>
    </div>
  `,
  })
