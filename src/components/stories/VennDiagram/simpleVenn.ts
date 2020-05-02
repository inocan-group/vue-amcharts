import { VennDiagram, VennSeries } from '../../index'
import { select, number, text } from '@storybook/addon-knobs'

export const simpleVenn = () => ({
  data: () => ({
    dataset: [
      { name: 'A', value: 10, color: '#8F3985' },
      { name: 'B', value: 10, color: '#07BEB8' },
      { name: 'C', value: 3, color: '#EFD9CE', sets: ['A', 'B'] },
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
      default: text('labelText', '{category}: [bold]{value}[/]', 'Component'),
    },
    labelFontSize: {
      default: number('labelFontSize', 16, { min: 0 }, 'Component'),
    },
    labelFill: {
      default: text('labelFill', '#000000', 'Component'),
    },
    tooltipText: {
      default: text('toolTipText', '{category}: [bold]{value}[/]', 'Component'),
    },
  },
  components: { VennDiagram, VennSeries },
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
      </venn-diagram>
    </div>
  `,
})
