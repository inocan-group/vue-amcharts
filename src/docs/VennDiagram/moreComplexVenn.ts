import { VennDiagram, VennSeries, ChartLegend } from '@/components'
import { select, number, text } from '@storybook/addon-knobs'

export const moreComplexVenn = () => ({
  data: () => ({
    dataset: [
      { name: 'A', value: 10 },
      { name: 'B', value: 10 },
      { name: 'C', value: 10 },
      { name: 'X', value: 2, sets: ['A', 'B'] },
      { name: 'Y', value: 2, sets: ['A', 'C'] },
      { name: 'Z', value: 2, sets: ['B', 'C'] },
      { name: 'Q', value: 1, sets: ['A', 'B', 'C'] },
    ],
  }),
  props: {
    intersections: {
      default: select(
        'intersections',
        {
          'A/B': 'sets',
          None: undefined,
        },
        'sets',
        'Component',
      ),
    },
    fillOpacity: {
      default: number(
        'fillOpacity',
        1,
        {
          min: 0,
          max: 1,
          step: 0.1,
        },
        'Component',
      ),
    },
    labelText: {
      default: text('labelText', '{value}', 'Component'),
    },
    labelFontSize: {
      default: number('labelFontSize', 16, { min: 0 }, 'Component'),
    },
    labelFill: {
      default: text('labelFill', '#000000', 'Component'),
    },
    tooltipText: {
      default: text('toolTipText', '{value}', 'Component'),
    },
  },
  components: { VennDiagram, VennSeries, ChartLegend },
  template: `
    <div style="width: 100%; height: 500px">
      <venn-diagram>
        <venn-series
        :data="dataset"
        value="value"
        category="name"
        :intersections="intersections"
        fill="color"
        :fill-opacity="fillOpacity"
        :label-text="labelText"
        :label-font-size="labelFontSize"
        :label-fill="labelFill"
        :tooltip-text="tooltipText"
        />
        <chart-legend position="bottom" />
      </venn-diagram>
    </div>
  `,
})
