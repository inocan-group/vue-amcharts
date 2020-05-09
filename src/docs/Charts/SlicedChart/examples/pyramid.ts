import { SliceChart, PyramidSeries } from '@/components'
import { select, boolean, text, number } from '@storybook/addon-knobs'

export const pyramidSeries = () => {
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
      topWidth: {
        default: number('Top Width', 0, {}, 'Component'),
      },
      bottomWidth: {
        default: text('Bottom Width', '100%', 'Component'),
      },
      tooltipText: {
        default: text(
          'Tooltip text',
          "[bold]{category}:[/] {value.percent.formatNumber('#.#')}% ({value.value})%",
          'Component',
        ),
      },
      valueIs: {
        default: select('valueIs prop', { area: 'area', height: 'height' }, 'area', 'Component'),
      },

      labelText: {
        default: text('Label Text', "{category}: {value.percent.formatNumber('#.0')}%", 'Labels'),
      },

      alignLabels: {
        default: boolean('Align the labels', true, 'Labels'),
      },
      alignOpposite: {
        default: boolean('Align to the opposite side (aka, the right side)', false, 'Labels'),
      },
      disableLabels: {
        default: boolean('Disable the labels (and ticks)', false, 'Labels'),
      },
    },
    components: { SliceChart, PyramidSeries },
    template: `
    <div style="width: 100%; height: 500px">
      <slice-chart :data="sliceData" >
        <pyramid-series 
          valueProp="value"
          categoryProp="name"
          :valueIs="valueIs"
          :topWidth="topWidth"
          :bottomWidth="bottomWidth"

          :tooltipText="tooltipText"

          :labelText="labelText"
          :alignLabels="alignLabels"
          :alignOpposite="alignOpposite"
          :disableLabels="disableLabels"
        />
      </slice-chart>
    </div>
  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
