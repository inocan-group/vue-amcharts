import { SankeyDiagram, ChartLegend } from '../../index'
import { select, boolean } from '@storybook/addon-knobs'

export const simpleSankey = () => {
  return {
    data: () => ({
      dataset: [
        { from: 'A', to: 'D', value: 10 },
        { from: 'B', to: 'D', value: 8 },
        { from: 'B', to: 'E', value: 4 },
        { from: 'C', to: 'E', value: 3 },
        { from: 'D', to: 'G', value: 5 },
        { from: 'D', to: 'I', value: 2 },
        { from: 'D', to: 'H', value: 3 },
        { from: 'E', to: 'H', value: 6 },
        { from: 'G', to: 'J', value: 5 },
        { from: 'I', to: 'J', value: 1 },
        { from: 'H', to: 'J', value: 9 },
      ],
    }),
    props: {
      sortBy: {
        default: select('Sort By', { none: 'none', name: 'name', value: 'value' }, 'none', 'Component'),
      },
      // strokeColor: {
      //   default: select('Stroke Color', { black: '#000', white: '#fff', red: '#efef89' }, '#fff', 'Component'),
      // },
      strokeWidth: {
        default: select('Stroke Width', { 20: 20, 10: 10, 5: 5, 1: 1, 0: 0 }, 20, 'Component'),
      },
      clickable: {
        default: boolean('Clickable', true, 'Component'),
      },
      draggable: {
        default: boolean('Draggable', true, 'Component'),
      },
    },

    components: { SankeyDiagram, ChartLegend },

    template: `
    <div id="story-container" style="width: 100%; height: 500px;">
      <sankey-diagram 
        :data="dataset" 
        :sort-by="sortBy" 
        :stroke-width="strokeWidth" 
        :clickable="clickable"
        :draggable="draggable"
      />
    </div>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
