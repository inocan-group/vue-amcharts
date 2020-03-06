import LineScatterChart from './LineScatterChart.vue'

export default { title: 'plotly/LineScatterChart' }

export const lineScatterChart = () => ({
  components: { LineScatterChart },
  template: '<line-scatter-chart/>',
})
