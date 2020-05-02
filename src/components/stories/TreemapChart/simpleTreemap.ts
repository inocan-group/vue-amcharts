import { TreemapChart } from '../../index'
import { number, select } from '@storybook/addon-knobs'

export const simpleTreemap = () => ({
  data: () => ({
    dataset: [
      {
        name: 'First',
        value: 190,
      },
      {
        name: 'Second',
        value: 289,
      },
      {
        name: 'Third',
        value: 635,
      },
      {
        name: 'Fourth',
        value: 732,
      },
      {
        name: 'Fifth',
        value: 835,
      },
    ],
  }),
  props: {
    colorsStep: {
      default: number('colors step (skip every x-th color)', 1, { min: 0 }, 'Component'),
    },
    layoutAlgorithm: {
      default: select(
        'layout algorithm',
        { binaryTree: 'binaryTree', dice: 'dice', slice: 'slice', sliceDice: 'sliceDice', squarify: 'squarify' },
        'squarify',
        'Component',
      ),
    },
  },
  components: { TreemapChart },
  template: `
    <div style="width: 100%; height: 500px">
      <treemap-chart
      :data="dataset"
      name="name"
      value="value"
      children="children"
      :colors-step="colorsStep"
      :layout-algorithm="layoutAlgorithm"
      >
      </treemap-chart>
    </div>
  `,
})
