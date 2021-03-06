import { SunburstDiagram } from '@/components'
import { number } from '@storybook/addon-knobs'

export const simpleSunburst = () => ({
  data: () => ({
    dataset: [
      {
        name: 'First',
        children: [
          { name: 'A1', value: 100 },
          { name: 'A2', value: 60 },
        ],
      },
      {
        name: 'Second',
        children: [
          { name: 'B1', value: 135 },
          { name: 'B2', value: 98 },
        ],
      },
      {
        name: 'Third',
        children: [
          {
            name: 'C1',
            children: [
              { name: 'EE1', value: 130 },
              { name: 'EE2', value: 87 },
              { name: 'EE3', value: 55 },
            ],
          },
          { name: 'C2', value: 148 },
          {
            name: 'C3',
            children: [
              { name: 'CC1', value: 53 },
              { name: 'CC2', value: 30 },
            ],
          },
          { name: 'C4', value: 26 },
        ],
      },
      {
        name: 'Fourth',
        children: [
          { name: 'D1', value: 415 },
          { name: 'D2', value: 148 },
          { name: 'D3', value: 89 },
        ],
      },
      {
        name: 'Fifth',
        children: [
          {
            name: 'E1',
            children: [
              { name: 'EE1', value: 33 },
              { name: 'EE2', value: 40 },
              { name: 'EE3', value: 89 },
            ],
          },
          {
            name: 'E2',
            value: 148,
          },
        ],
      },
    ],
  }),
  props: {
    colorsStep: {
      default: number('colors step (skip every x-th color)', 1, { min: 0 }, 'Component'),
    },
    radius: {
      default: number('radius', 100, { min: 0, max: 100, step: 10 }, 'Component'),
    },
    innerRadius: {
      default: number('inner radius', 0, { min: 0, max: 100, step: 10 }, 'Component'),
    },
  },
  components: { SunburstDiagram },
  template: `
    <div style="width: 100%; height: 500px">
      <sunburst-diagram :data="dataset" name="name" value="value" children="children" :colors-step="colorsStep" :radius="radius" :inner-radius="innerRadius">
      </sunburst-diagram>
    </div>
  `,
})

simpleSunburst.story = {
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
  },
}
