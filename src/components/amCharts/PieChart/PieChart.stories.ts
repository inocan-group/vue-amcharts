import PieChart from './PieChart.vue'
import { withKnobs, object, text } from '@storybook/addon-knobs'

export default { title: 'amCharts/PieChart', decorators: [withKnobs] }

export const example1 = () => ({
  components: { PieChart },
  props: {
    chartData: {
      default: object('chartData', [
        {
          country: 'Lithuania',
          liters: 501.9,
        },
        {
          country: 'Czech Republic',
          liters: 301.9,
        },
        {
          country: 'Ireland',
          liters: 201.1,
        },
        {
          country: 'Germany',
          liters: 165.8,
        },
        {
          country: 'Australia',
          liters: 139.9,
        },
        {
          country: 'Austria',
          liters: 128.3,
        },
        {
          country: 'UK',
          liters: 99,
        },
        {
          country: 'Belgium',
          liters: 60,
        },
        {
          country: 'The Netherlands',
          liters: 50,
        },
      ]),
    },
    category: {
      default: text('category', 'country'),
    },
    value: {
      default: text('value', 'liters'),
    },
  },
  template: '<pie-chart v-bind="$props" />',
})
