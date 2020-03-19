import PlotlyChart from './PlotlyChart.vue'
import PlotlyBarTrace from './PlotlyBarTrace.vue'
import PlotlyPieTrace from './PlotlyPieTrace.vue'
import PlotlyScatterTrace from './PlotlyScatterTrace.vue'
import PlotlyLineTrace from './PlotlyLineTrace.vue'
import { withKnobs, object, text } from '@storybook/addon-knobs'

const TRACE_1 = 'Trace 1'
const TRACE_2 = 'Trace 2'

export default { title: 'plotly/PlotlyChart', decorators: [withKnobs] }

export const bar = () => ({
  components: { PlotlyChart, PlotlyBarTrace },
  props: {
    trace1: {
      default: object(
        'traceData',
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [20, 14, 23],
        },
        TRACE_1,
      ),
    },
    name1: {
      default: text('name', 'SF Zoo', TRACE_1),
    },
    trace2: {
      default: object(
        'traceData',
        {
          x: ['giraffes', 'orangutans', 'monkeys'],
          y: [12, 18, 29],
        },
        TRACE_2,
      ),
    },
    name2: {
      default: text('name2', 'LA Zoo', TRACE_2),
    },
  },
  template: `
  <plotly-chart>
    <plotly-bar-trace :trace-data="trace1" :name="name1" />
    <plotly-bar-trace :trace-data="trace2" :name="name2" />
  </plotly-chart>
  `,
})

export const pie = () => ({
  components: { PlotlyChart, PlotlyPieTrace },
  props: {
    traceData: {
      default: object('traceData', {
        values: [19, 26, 55],
        labels: ['Residential', 'Non-Residential', 'Utility'],
      }),
    },
  },
  template: `
  <plotly-chart>
    <plotly-pie-trace :trace-data="traceData" />
  </plotly-chart>
  `,
})

export const line = () => ({
  components: { PlotlyChart, PlotlyLineTrace },
  props: {
    trace1: {
      default: object(
        'traceData',
        {
          x: [2, 3, 4, 5],
          y: [16, 5, 11, 9],
        },
        TRACE_1,
      ),
    },
    mode1: {
      default: text('mode', 'lines', TRACE_1),
    },
    trace2: {
      default: object(
        'traceData',
        {
          x: [1, 2, 3, 4],
          y: [12, 9, 15, 12],
        },
        TRACE_2,
      ),
    },
    mode2: {
      default: text('mode', 'lines', TRACE_2),
    },
  },
  template: `
  <plotly-chart>
    <plotly-line-trace :trace-data="trace1" :mode="mode1" />
    <plotly-line-trace :trace-data="trace2" :mode="mode2" />
  </plotly-chart>
  `,
})

export const scatter = () => ({
  components: { PlotlyChart, PlotlyScatterTrace },
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
    trace1: {
      default: object(
        'traceData',
        {
          x: [1, 2, 3, 4, 5],
          y: [1, 6, 3, 6, 1],
        },
        TRACE_1,
      ),
    },
    mode1: {
      default: text('mode', 'text+markers', TRACE_1),
    },
    name1: {
      default: text('name', 'Team A', TRACE_1),
    },
    text1: {
      default: object('text', ['A-1', 'A-2', 'A-3', 'A-4', 'A-5'], TRACE_1),
    },
    textposition1: {
      default: text('textposition', 'top center', TRACE_1),
    },
    textfont1: {
      default: object(
        'textfont',
        {
          family: 'Raleway, sans-serif',
        },
        TRACE_1,
      ),
    },
    marker1: {
      default: object('marker', { size: 12 }, TRACE_1),
    },
    trace2: {
      default: object(
        'traceData',
        {
          x: [1.5, 2.5, 3.5, 4.5, 5.5],
          y: [4, 1, 7, 1, 4],
        },
        TRACE_2,
      ),
    },
    mode2: {
      default: text('mode', 'text+markers', TRACE_2),
    },
    name2: {
      default: text('name', 'Team B', TRACE_2),
    },
    text2: {
      default: object('text', ['B-a', 'B-b', 'B-c', 'B-d', 'B-e'], TRACE_2),
    },
    textposition2: {
      default: text('textposition', 'bottom center', TRACE_2),
    },
    textfont2: {
      default: object(
        'textfont',
        {
          family: 'Times New Roman',
        },
        TRACE_2,
      ),
    },
    marker2: {
      default: object('marker', { size: 12 }, TRACE_2),
    },
  },
  template: `
  <plotly-chart :layout="layout">
    <plotly-scatter-trace :trace-data="trace1"
    :mode="mode1"
    :name="name1"
    :text="text1"
    :textposition="textposition1"
    :textfont="textfont1"
    :marker="marker1" />
    <plotly-scatter-trace :trace-data="trace2"
    :mode="mode2"
    :name="name2"
    :text="text2"
    :textposition="textposition2"
    :textfont="textfont2"
    :marker="marker2" />
  </plotly-chart>
  `,
})
