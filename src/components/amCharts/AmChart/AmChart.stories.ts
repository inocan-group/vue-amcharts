import { XyChart, DateAxis, ValueAxis, LineSeries, XyScrollbar, ChartCursor, ChartLegend, ColumnSeries } from './index'
import { text, select } from '@storybook/addon-knobs'

export default { title: 'amCharts/Composable' }

export const lineChart = () => ({
  components: { XyChart, DateAxis, ValueAxis, LineSeries, XyScrollbar, ChartCursor, ChartLegend, ColumnSeries },
  props: {
    series1Name: { default: text('Series 1 Name', 'CPI') },
    series2Name: { default: text('Series 2 Name', 'Percent Change') },
    maxTooltipDistance: {
      default: select(
        'When to show both series tooltips',
        {
          'When Close': 20,
          'Pretty Close': 100,
          Always: undefined,
        },
        20,
      ),
    },
  },
  template: `
  <xy-chart data="http://localhost:6006/cpi.json">
    <date-axis dimension="x" />
    <value-axis 
      id="cpi" 
      name="Consumer Price Index" 
      dimension="y" 
    />
    <value-axis 
      id="percent" 
      name="Percentage Change" 
      dimension="y"
      numberFormat="%"
    />

    <xy-scrollbar axis="x" /> 

    <line-series 
      id="cpi"
      :name="series1Name"
      yProp="Index" 
      xProp="Date" 
      tooltipText="CPI: [bold]{Index}[/]"
      strokeWidth=3 
    />
    
    <line-series 
      id="percent"
      :name="series2Name" 
      yProp="Inflation" 
      xProp="Date" 
      yAxis="percent"
      tooltipText="Inflation change [bold]{Inflation}[/]"
    /> 

    <chart-cursor fullWidthX="true" :maxTooltipDistance="maxTooltipDistance" />
    <chart-legend />
  </xy-chart>
  `,
})
