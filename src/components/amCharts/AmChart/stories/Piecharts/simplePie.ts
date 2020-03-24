import { PieChart, PieSeries, ChartLegend } from '../../index'
import { select, array, boolean } from '@storybook/addon-knobs'

export const simplePie = () => {
  const pieData = [
    {
      count: 45,
      category: 'animals',
    },
    {
      count: 88,
      category: 'people',
    },
    {
      count: 23,
      category: 'things',
    },
  ]
  return {
    data: () => ({
      pieData,
    }),
    props: {
      stroke: {
        default: select(
          'Stroke Color',
          { Black: 'black', Red: 'red', Blue: 'blue', None: undefined },
          undefined,
          'Component',
        ),
      },
      strokeWidth: {
        default: select('Stroke Width', { None: 0, '2px': 2, '5px': 5 }, 0, 'Component'),
      },
      innerRadius: {
        default: select(
          'the innerRadius of the pie/donut chart',
          {
            None: 0,
            '25 pixels': '25px',
            '25 percent': '25%',
            '50 percent': '50%',
          },
          0,
          'Component',
        ),
      },
      show: {
        default: boolean('Show legend', false, 'Component'),
      },
      width: {
        default: select(
          'Width of the container',
          { '100%': '100%', '500px': '500px', '50%': '50%' },
          '100%',
          'Container',
        ),
      },
      height: {
        default: select(
          'Width of the container',
          { '800px': '800px', '500px': '500px', '300px': '300px' },
          '300px',
          'Container',
        ),
      },
    },
    components: { PieChart, PieSeries, ChartLegend },
    template: `
    <div class="container" :width="width" :height="height" >
    <pie-chart :data="pieData" :innerRadius="innerRadius">
      <pie-series valueProp="count" categoryProp="category" :stroke="stroke" :strokeWidth="strokeWidth" />
      <chart-legend :show="show" position="right" />
    </pie-chart>
    </div>
  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
