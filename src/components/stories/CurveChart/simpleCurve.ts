import { CurveChart, CurveColumnSeries, ValueAxis, CategoryAxis } from '../../index'
import { number, boolean, object } from '@storybook/addon-knobs'

export const simpleCurve = () => ({
  data: () => ({
    dataset: [
      {
        country: 'Lithuania',
        value: 501,
      },
      {
        country: 'Czechia',
        value: 301,
      },
      {
        country: 'Ireland',
        value: 201,
      },
      {
        country: 'Germany',
        value: 165,
      },
      {
        country: 'Australia',
        value: 139,
      },
      {
        country: 'Austria',
        value: 128,
      },
      {
        country: 'UK',
        value: 99,
      },
      {
        country: 'Belgium',
        value: 60,
      },
      {
        country: 'The Netherlands',
        value: 50,
      },
    ],
  }),
  props: {
    fillOpacity: {
      default: number('fillOpacity', 0.5, { min: 0, max: 1, step: 0.1 }, 'Component'),
    },
    strokeWidth: {
      default: number('strokeWidth', 2, { min: 0, step: 1 }, 'Component'),
    },
    radius: {
      default: number('y axis radius', 100, { min: 0 }, 'Component'),
    },
    innerRadius: {
      default: number('y axis inner radius', 0, { min: 0 }, 'Component'),
    },
    tensionX: {
      default: number('curve tension', 0.8, { min: 0, max: 1, step: 0.1 }, 'Component'),
    },
    disableGridY: {
      default: boolean('disable y grid', true, 'Component'),
    },
    disableGridX: {
      default: boolean('disable x grid', true, 'Component'),
    },
    controlPoints: {
      default: object(
        'x axis control points',
        [
          { x: -400, y: 0 },
          { x: -250, y: 0 },
          { x: 0, y: 60 },
          { x: 250, y: 0 },
          { x: 400, y: 0 },
        ],
        'Component',
      ),
    },
  },
  components: { CurveChart, CurveColumnSeries, CategoryAxis, ValueAxis },
  template: `
    <div style="width: 100%; height: 300px">
        <curve-chart :data="dataset" ref="curveChart">
            <value-axis dimension="y" :radius="radius" :inner-radius="innerRadius" :disable-grid="disableGridY" />
            <category-axis dimension="x" category="country" :tension-x="tensionX" :control-points="controlPoints" :disable-grid="disableGridX" />
            <curve-column-series x-prop="country" y-prop="value" :fill-opacity="fillOpacity" :stroke-width="strokeWidth" />
        </curve-chart>
    </div>
  `,
  mounted() {
    this.$refs.curveChart.chart.padding(40, 40, 40, 40)
  },
})
