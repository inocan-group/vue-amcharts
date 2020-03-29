import BarChart from './BarChart.vue'
import { withKnobs, object } from '@storybook/addon-knobs'

export default { title: 'plotly/BarChart', decorators: [withKnobs] }

export const example1 = () => ({
  components: { BarChart },
  props: {
    chartData: {
      default: object('chartData', [
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [20, 14, 23],
          name: 'SF Zoo',
          type: 'bar',
        },
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [12, 18, 29],
          name: 'LA Zoo',
          type: 'bar',
        },
      ]),
    },
  },
  template: '<bar-chart v-bind="$props" />',
})
