import { SliceChart, FunnelSeries } from '../../index'
import { select, array } from '@storybook/addon-knobs'
import { color } from '@amcharts/amcharts4/.internal/core/utils/Color'

export const simpleSlice = () => {
  const sliceData = [
    {
      name: 'Stage #1',
      value: 600,
    },
    {
      name: 'Stage #2',
      value: 300,
    },
    {
      name: 'Stage #3',
      value: 200,
    },
    {
      name: 'Stage #4',
      value: 180,
    },
    {
      name: 'Stage #5',
      value: 50,
    },
    {
      name: 'Stage #6',
      value: 20,
    },
    {
      name: 'Stage #7',
      value: 10,
    },
  ]
  return {
    data: () => ({
      sliceData,
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
    components: { SliceChart, FunnelSeries },
    template: `
    <div style="width: 100%; height: 500px">
      <slice-chart :data="sliceData" >
        <funnel-series />
      </slice-chart>
    </div>
  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
