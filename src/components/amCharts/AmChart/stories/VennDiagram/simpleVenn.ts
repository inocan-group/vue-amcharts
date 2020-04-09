import { VennDiagram, VennSeries } from '../../index'
import { select } from '@storybook/addon-knobs'

export const simpleVenn = () => ({
  data: () => ({
    dataset: [
      { name: 'A', value: 10 },
      { name: 'B', value: 10 },
      { name: 'C', value: 3, sets: ['A', 'B'] },
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
  },
  components: { VennDiagram, VennSeries },
  template: `
    <div style="width: 100%; height: 500px">
      <venn-diagram>
        <venn-series :data="dataset" value="value" category="name" :intersections="intersections" />
      </venn-diagram>
    </div>
  `,
})
