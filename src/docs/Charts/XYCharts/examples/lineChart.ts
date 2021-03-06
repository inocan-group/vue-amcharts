import {
  XyChart,
  DateAxis,
  ValueAxis,
  LineSeries,
  XyScrollbar,
  XyCursor,
  ChartLegend,
  ColumnSeries,
} from '@/components'
import { text, select, boolean } from '@storybook/addon-knobs'

export const lineChart = () => ({
  components: { XyChart, DateAxis, ValueAxis, LineSeries, XyScrollbar, XyCursor, ChartLegend, ColumnSeries },
  props: {
    series1Name: { default: text('Series 1 Name (cpi)', 'CPI') },
    cpiWidth: { default: select('CPI series line width', { 1: 1, 2: 2, 3: 3, 5: 5 }, 3) },
    cpiColor: { default: select('CPI line color', { red: '#ff0000', blue: '#69B7DC' }, '#69B7DC') },

    series2Name: { default: text('Series 2 Name (interest)', 'Percent Change') },
    showPercent: { default: boolean('Show percentage series', true) },

    yAxisLeft: { default: text('yAxis (left)', 'Consumer Price Index') },
    yAxisRight: { default: text('yAxis (right)', 'Percentage Change') },

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
  <xy-chart url="cpi.json">
    <date-axis dimension="x" />
    <value-axis 
      id="cpi" 
      :name="yAxisLeft" 
      dimension="y" 
    />
    <value-axis 
      id="percent" 
      :name="yAxisRight" 
      dimension="y"
      numberFormat="%"
    />

    <xy-scrollbar axis="x" /> 

    <line-series 
      id="cpi"
      :name="series1Name"
      :color="cpiColor"
      yProp="Index" 
      xProp="Date" 
      tooltipText="CPI: [bold]{Index}[/]"
      :strokeWidth="cpiWidth" 
    />
    
    <line-series 
      id="percent"
      :name="series2Name" 
      yProp="Inflation" 
      xProp="Date" 
      yAxis="percent"
      :show="showPercent"
      tooltipText="Inflation change [bold]{Inflation}[/]"
    /> 

    <xy-cursor :maxTooltipDistance="maxTooltipDistance" />
    <chart-legend :show="Boolean(true)"/>
  </xy-chart>
  `,
})

lineChart.story = {
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
  },
}
