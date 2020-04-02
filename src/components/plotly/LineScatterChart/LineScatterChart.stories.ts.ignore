import LineScatterChart from './LineScatterChart.vue'
import { withKnobs, object } from '@storybook/addon-knobs'

export default { title: 'plotly/LineScatterChart', decorators: [withKnobs] }

export const example1 = () => ({
  components: { LineScatterChart },
  props: {
    chartData: {
      default: object('chartData', [
        {
          x: [1, 2, 3, 4, 5],
          y: [1, 6, 3, 6, 1],
          mode: 'text+markers',
          type: 'scatter',
          name: 'Team A',
          text: ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'],
          textposition: 'top center',
          textfont: {
            family: 'Raleway, sans-serif',
          },
          marker: { size: 12 },
        },
        {
          x: [1.5, 2.5, 3.5, 4.5, 5.5],
          y: [4, 1, 7, 1, 4],
          mode: 'text+markers',
          type: 'scatter',
          name: 'Team B',
          text: ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'],
          textfont: {
            family: 'Times New Roman',
          },
          textposition: 'bottom center',
          marker: { size: 12 },
        },
      ]),
    },
    layout: {
      default: object('layout', {
        xaxis: {
          range: [0.75, 5.25],
        },
        yaxis: {
          range: [0, 8],
        },
        legend: {
          y: 0.5,
          yref: 'paper',
          font: {
            family: 'Arial, sans-serif',
            size: 20,
            color: 'grey',
          },
        },
        title: 'Data Labels on the Plot',
      }),
    },
  },
  template: '<line-scatter-chart v-bind="$props" />',
})
