import { PieChart, PieSeries } from '../../index'
import { select, array } from '@storybook/addon-knobs'
import { color } from '@amcharts/amcharts4/.internal/core/utils/Color'

export const pieInAPie = () => {
  const pieData = [
    {
      count: 45,
      max: 80,
      category: 'animals',
      subColor: color('#ED1C24'),
    },
    {
      count: 88,
      max: 92,
      category: 'people',
      subColor: color('grey'),
    },
    {
      count: 23,
      max: 35,
      category: 'things',
      subColor: color('darkgrey'),
    },
  ]
  return {
    data: () => ({
      pieData,
    }),
    props: {
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
    components: { PieChart, PieSeries },
    template: `
    <div class="container" :width="width" :height="height" >
    <pie-chart :data="pieData" :innerRadius="innerRadius">
      <pie-series valueProp="count" categoryProp="category" />
      <pie-series valueProp="max" categoryProp="category" fillProp="subColor" />
    </pie-chart>
    </div>
  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
