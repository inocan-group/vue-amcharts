import { RadarChart, RadarSeries, RadarColumnSeries, ValueAxis, CategoryAxis, ChartLegend } from '../../index'
import { select } from '@storybook/addon-knobs'

export const withMixedSeries = () => ({
  data: () => ({
    dataset: [
      {
        country: 'Lithuania',
        liters: 501,
        units: 250,
      },
      {
        country: 'Czech Republic',
        liters: 301,
        units: 222,
      },
      {
        country: 'Ireland',
        liters: 266,
        units: 179,
      },
      {
        country: 'Germany',
        liters: 165,
        units: 298,
      },
      {
        country: 'Australia',
        liters: 139,
        units: 299,
      },
      {
        country: 'Austria',
        liters: 336,
        units: 185,
      },
      {
        country: 'UK',
        liters: 290,
        units: 150,
      },
      {
        country: 'Belgium',
        liters: 325,
        units: 382,
      },
      {
        country: 'The Netherlands',
        liters: 40,
        units: 172,
      },
    ],
  }),
  props: {
    gridType: {
      default: select('radial axis grid type', { circular: 'circular', polygons: 'polygons' }, 'circular', 'Component'),
    },
  },
  components: { RadarChart, RadarSeries, RadarColumnSeries, CategoryAxis, ChartLegend, ValueAxis },
  template: `
    <div style="width: 100%; height: 300px">
        <radar-chart :data="dataset">
            <value-axis dimension="y" :grid-type="gridType" />
            <category-axis dimension="x" category="country"/>
            <radar-series name="Sales" x-prop="country" y-prop="liters" :stroke-width="3" />
            <radar-column-series name="Units" x-prop="country" y-prop="units" fill="#CDA2AB" :stroke-width="0" tooltip-text="Series: {name}\nCategory: {categoryX}\nValue: {valueY}" />
            <chart-legend/>
        </radar-chart>
    </div>
  `,
})
