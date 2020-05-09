import { RadarChart, RadarSeries, RadarColumnSeries, ValueAxis, CategoryAxis } from '@/components'
import { select } from '@storybook/addon-knobs'

export const simpleRadar = () => ({
  data: () => ({
    dataset: [
      {
        country: 'Lithuania',
        liters: 501,
      },
      {
        country: 'Czech Republic',
        liters: 301,
      },
      {
        country: 'Ireland',
        liters: 266,
      },
      {
        country: 'Germany',
        liters: 165,
      },
      {
        country: 'Australia',
        liters: 139,
      },
      {
        country: 'Austria',
        liters: 336,
      },
      {
        country: 'UK',
        liters: 290,
      },
      {
        country: 'Belgium',
        liters: 325,
      },
      {
        country: 'The Netherlands',
        liters: 40,
      },
    ],
  }),
  props: {
    gridType: {
      default: select('radial axis grid type', { circular: 'circular', polygons: 'polygons' }, 'circular', 'Component'),
    },
  },
  components: { RadarChart, RadarSeries, RadarColumnSeries, CategoryAxis, ValueAxis },
  template: `
    <div style="width: 100%; height: 300px">
        <radar-chart :data="dataset">
            <value-axis dimension="y" :grid-type="gridType" />
            <category-axis dimension="x" category="country"/>
            <radar-series x-prop="country" y-prop="liters" :stroke-width="3" />
        </radar-chart>
    </div>
  `,
})
