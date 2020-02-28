import XYChart from './XYChart.vue'

export default { title: 'amCharts/XYChart' }

export const lineChart = () => ({
  components: { XYChart },
  template: '<x-y-chart/>',
})
