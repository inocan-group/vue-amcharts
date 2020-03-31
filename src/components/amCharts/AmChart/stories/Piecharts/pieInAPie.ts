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
          '25%',
          'Component',
        ),
      },
    },
    components: { PieChart, PieSeries },
    template: `
    <div style="width: 100%; height: 500px">
      <pie-chart :data="pieData" :innerRadius="innerRadius" >
        <pie-series valueProp="count" categoryProp="category" />
        <pie-series valueProp="max" categoryProp="category" fillProp="subColor" />
      </pie-chart>
    </div>
  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
