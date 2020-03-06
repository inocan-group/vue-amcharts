import BarChart from './BarChart.vue'

export default { title: 'plotly/BarChart' }

export const barChart = () => ({
  components: { BarChart },
  template: '<bar-chart/>',
})
