import { SliceChart, FunnelSeries } from '../../index'
import { select, boolean, text } from '@storybook/addon-knobs'

export const funnelSeries = () => {
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
      bottomRatio: {
        default: select(
          'bottomRatio (ratio of top width to bottom width)',
          {
            'rectangular (aka, 0)': 0,
            '0.5 (half way)': 0.5,
            "1.0 (bottom width aligns with next's top": 1,
          },
          0,
          'Component',
        ),
      },
      tooltipText: {
        default: text(
          'Tooltip text',
          "[bold]{category}:[/] {value.percent.formatNumber('#.#')}% ({value.value})%",
          'Component',
        ),
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

      linksHeight: {
        default: select('Height of the links', { None: 0, Default: 10, Big: 20 }, 10, 'Links'),
      },
      linksOpacity: {
        default: select(
          'Opacity of the links',
          { 'Subtle (0.25)': 0.25, 'Default (0.5)': 0.5, 'Dark (0.75)': 20 },
          0.5,
          'Links',
        ),
      },
      orientation: {
        default: select(
          'Orientation of Funnel',
          { horizontal: 'horizontal', vertical: 'vertical' },
          'vertical',
          'Component',
        ),
      },

      gradientBrightness: {
        default: select(
          'Gradient Brightness',
          {
            None: [],
            Subtle: [-0.25, 1, -0.25],
            Moderate: [-0.5, 1, -0.5],
            Heavy: [-0.75, 1, -0.75],
          },
          [-0.25, 1, -0.25],
          'Component',
        ),
      },
      gradientOffsets: {
        default: select(
          'Gradient Offsets',
          {
            None: [],
            On: [0, 0.5, 1],
          },
          [],
          'Component',
        ),
      },
    },
    components: { SliceChart, FunnelSeries },
    template: `
    <div style="width: 100%; height: 500px">
      <slice-chart :data="sliceData" >
        <funnel-series 
          valueProp="value"
          categoryProp="name"
          :bottomRatio="bottomRatio"
          :gradientBrightness="gradientBrightness"

          :tooltipText="tooltipText"

          :labelText="labelText"
          :alignLabels="alignLabels"
          :alignOpposite="alignOpposite"
          :disableLabels="disableLabels"

          :linksHeight="linksHeight"
        />
      </slice-chart>
    </div>
  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
