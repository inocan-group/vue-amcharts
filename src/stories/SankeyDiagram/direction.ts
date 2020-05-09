import { SankeyDiagram, ChartLegend } from '@/components'
import { select } from '@storybook/addon-knobs'

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
    },

    components: { SankeyDiagram, ChartLegend },

    template: `
    <div id="story-container" style="width: 100%; height: 500px;">
    <sankey-diagram :data="dataset" :sort-by="sortBy" />
    </div>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
