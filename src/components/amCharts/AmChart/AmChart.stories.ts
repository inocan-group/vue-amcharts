import { XyChart, DateAxis, ValueAxis, LineSeries, XyScrollbar } from './index'

export default { title: 'amCharts/Composable' }

export const xyChart = () => ({
  components: { XyChart, DateAxis, ValueAxis, LineSeries, XyScrollbar },
  template: `
  <xy-chart data="http://localhost:6006/cpi.json">
    <date-axis name="dates" dimension="x" />
    <value-axis name="primary" dimension="y" />
    <!-- <xy-scrollbar axis="x" series="dates" /> -->

    <line-series name="cpi" yProp="Index" xProp="Date"  />
    <!-- <line-series yProp="Percent" xProp="Date"  /> -->
  </xy-chart>
  `,
})

// foo: `
// <xy-chart :data="http://localhost:6006/cpi.json" slot-props="{ xAxis, yAxis, series }">
//   <date-axis dimension="x"  />
//   <value-axis dimension="y" name="primary" />
//   <value-axis dimension="y" name="secondary" />

//   <xy-scrollbar :series="series.cpi" />
//   <line-series name="cpi" xProp="Index" yProp="Date" :yAxis="YAxis.primary" />
//   <line-series xProp="Percent" yProp="Date" :yAxis="YAxis.secondary" />`
// </xy-chart>`
