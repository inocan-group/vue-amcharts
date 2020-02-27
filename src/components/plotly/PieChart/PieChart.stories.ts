import PieChart from './PieChart.vue'

export default { title: 'plotly/PieChart' }

export const pieChart = () => ({
  components: { PieChart },
  template: '<pie-chart/>',
})
