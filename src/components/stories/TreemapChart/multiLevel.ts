import { TreemapChart } from '../../index'
import { number, select } from '@storybook/addon-knobs'

export const multiLevel = () => ({
  data: () => ({
    dataset: [
      {
        name: 'First',
        children: [
          { name: 'A1', value: 100 },
          { name: 'A2', value: 60 },
          { name: 'A3', value: 30 },
        ],
      },
      {
        name: 'Second',
        children: [
          { name: 'B1', value: 135 },
          { name: 'B2', value: 98 },
          { name: 'B3', value: 56 },
        ],
      },
      {
        name: 'Third',
        children: [
          { name: 'C1', value: 335 },
          { name: 'C2', value: 148 },
          { name: 'C3', value: 126 },
          { name: 'C4', value: 26 },
        ],
      },
      {
        name: 'Fourth',
        children: [
          { name: 'D1', value: 415 },
          { name: 'D2', value: 148 },
          { name: 'D3', value: 89 },
          { name: 'D4', value: 64 },
          { name: 'D5', value: 16 },
        ],
      },
      {
        name: 'Fifth',
        children: [
          { name: 'E1', value: 687 },
          { name: 'E2', value: 148 },
        ],
      },
    ],
  }),
  props: {
    colorsStep: {
      default: number('colors step (skip every x-th color)', 1, { min: 0 }, 'Component'),
    },
    maxLevels: {
      default: select('max. number of levels the chart will display initially', { 1: 1, 2: 2 }, 2, 'Component'),
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
      :max-levels="maxLevels"
      :layout-algorithm="layoutAlgorithm"
      >
      </treemap-chart>
    </div>
  `,
})
