import { XyChart, DateAxis, ValueAxis, LineSeries, XyScrollbar, ChartCursor, ChartLegend } from './index'

export default { title: 'amCharts/Composable' }

export const lineChart = () => ({
  components: { XyChart, DateAxis, ValueAxis, LineSeries, XyScrollbar, ChartCursor, ChartLegend },
  template: `
  <xy-chart data="http://localhost:6006/cpi.json">
    <date-axis 
      dimension="x" 
    />
    <value-axis 
      id="cpi" 
      name="Consumer Price Index" 
      dimension="y" 
    />
    <value-axis 
      id="percent" 
      name="Percentage Change" 
      dimension="y"
      min=-1
      max=1
    />

    <xy-scrollbar axis="x" series="dates" />

    <line-series 
      id="cpi"
      name="CPI"
      yProp="Index" 
      xProp="Date" 
      tooltipText="Inflation {Inflation}, CPI: {Index}"
      strokeWidth=3 
    />
    <line-series 
      id="percent"
      name="Percent Change" 
      yProp="Percent" 
      xProp="Date" 
      yAxis="percent" 
      tooltipText="Inflation change [bold]{Inflation}[/]"
    />

    <chart-cursor />
    <chart-legend />
  </xy-chart>
  `,
})
