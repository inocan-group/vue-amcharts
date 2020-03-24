import PlotlyChart from './PlotlyChart.vue'
import PlotlyBarSeries from './PlotlyBarSeries.vue'
import PlotlyPieSeries from './PlotlyPieSeries.vue'
import PlotlyScatterSeries from './PlotlyScatterSeries.vue'
import PlotlyLineSeries from './PlotlyLineSeries.vue'
import { withKnobs, object, text } from '@storybook/addon-knobs'

const SERIES_1 = 'Series 1'
const SERIES_2 = 'Series 2'

export default { title: 'plotly/PlotlyChart', decorators: [withKnobs] }

export const bar = () => ({
  components: { PlotlyChart, PlotlyBarSeries },
  props: {
    series1: {
      default: object(
        'seriesData',
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [20, 14, 23],
        },
        SERIES_1,
      ),
    },
    name1: {
      default: text('name', 'SF Zoo', SERIES_1),
    },
    series2: {
      default: object(
        'seriesData',
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [12, 18, 29],
        },
        SERIES_2,
      ),
    },
    name2: {
      default: text('name2', 'LA Zoo', SERIES_2),
    },
  },
  template: `
  <plotly-chart>
    <plotly-bar-series :series-data="series1" :name="name1" />
    <plotly-bar-series :series-data="series2" :name="name2" />
  </plotly-chart>
  `,
})

export const pie = () => ({
  components: { PlotlyChart, PlotlyPieSeries },
  props: {
    seriesData: {
      default: object('seriesData', {
        values: [19, 26, 55],
        labels: ['Residential', 'Non-Residential', 'Utility'],
      }),
    },
  },
  template: `
  <plotly-chart>
    <plotly-pie-series :series-data="seriesData" />
  </plotly-chart>
  `,
})

export const line = () => ({
  components: { PlotlyChart, PlotlyLineSeries },
  props: {
    series1: {
      default: object(
        'seriesData',
        {
          x: [2, 3, 4, 5],
          y: [16, 5, 11, 9],
        },
        SERIES_1,
      ),
    },
    mode1: {
      default: text('mode', 'lines', SERIES_1),
    },
    series2: {
      default: object(
        'seriesData',
        {
          x: [1, 2, 3, 4],
          y: [12, 9, 15, 12],
        },
        SERIES_2,
      ),
    },
    mode2: {
      default: text('mode', 'lines', SERIES_2),
    },
  },
  template: `
  <plotly-chart>
    <plotly-line-series :series-data="series1" :mode="mode1" />
    <plotly-line-series :series-data="series2" :mode="mode2" />
  </plotly-chart>
  `,
})

export const scatter = () => ({
  components: { PlotlyChart, PlotlyScatterSeries },
  props: {
    layout: {
      default: object(
        'layout',
        {
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
        },
        'Layout',
      ),
    },
    series1: {
      default: object(
        'seriesData',
        {
          x: [1, 2, 3, 4, 5],
          y: [1, 6, 3, 6, 1],
        },
        SERIES_1,
      ),
    },
    mode1: {
      default: text('mode', 'text+markers', SERIES_1),
    },
    name1: {
      default: text('name', 'Team A', SERIES_1),
    },
    text1: {
      default: object('text', ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'], SERIES_1),
    },
    textposition1: {
      default: text('textposition', 'top center', SERIES_1),
    },
    textfont1: {
      default: object(
        'textfont',
        {
          family: 'Raleway, sans-serif',
        },
        SERIES_1,
      ),
    },
    marker1: {
      default: object('marker', { size: 12 }, SERIES_1),
    },
    series2: {
      default: object(
        'seriesData',
        {
          x: [1.5, 2.5, 3.5, 4.5, 5.5],
          y: [4, 1, 7, 1, 4],
        },
        SERIES_2,
      ),
    },
    mode2: {
      default: text('mode', 'text+markers', SERIES_2),
    },
    name2: {
      default: text('name', 'Team B', SERIES_2),
    },
    text2: {
      default: object('text', ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'], SERIES_2),
    },
    textposition2: {
      default: text('textposition', 'bottom center', SERIES_2),
    },
    textfont2: {
      default: object(
        'textfont',
        {
          family: 'Times New Roman',
        },
        SERIES_2,
      ),
    },
    marker2: {
      default: object('marker', { size: 12 }, SERIES_2),
    },
  },
  template: `
  <plotly-chart :layout="layout">
    <plotly-scatter-series :series-data="series1"
    :mode="mode1"
    :name="name1"
    :text="text1"
    :textposition="textposition1"
    :textfont="textfont1"
    :marker="marker1" />
    <plotly-scatter-series :series-data="series2"
    :mode="mode2"
    :name="name2"
    :text="text2"
    :textposition="textposition2"
    :textfont="textfont2"
    :marker="marker2" />
  </plotly-chart>
  `,
})
