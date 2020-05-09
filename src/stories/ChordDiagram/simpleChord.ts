import { ChordDiagram, ChartLegend } from '@/components'
import { select } from '@storybook/addon-knobs'

export const simpleChord = () => {
  return {
    data: () => ({
      dataset: [
        { from: 'A', to: 'D', value: 10 },
        { from: 'B', to: 'D', value: 8 },
        { from: 'B', to: 'E', value: 4 },
        { from: 'B', to: 'C', value: 2 },
        { from: 'C', to: 'E', value: 14 },
        { from: 'E', to: 'D', value: 8 },
        { from: 'C', to: 'A', value: 4 },
        { from: 'G', to: 'A', value: 7 },
        { from: 'D', to: 'B', value: 1 },
      ],
    }),
    props: {
      innerRadius: {
        default: select(
          'innerRadius of the chord diagram',
          {
            None: 0,
            '-25% pixels': '-25%',
            '-30 pixels': -30,
            '-15 pixels': -15,
            '15 pixels': '15',
            '25 percent': '25%',
            '50 percent': '50%',
            '75 percent': '75%',
          },
          '50%',
          'Component',
        ),
      },
      linkStrokeWidth: {
        default: select(
          'Stroke width -- which if set -- removes normal chord pattern',
          {
            None: null,
            '3 pixels': 3,
            '8 pixels': 8,
          },
          null,
          'Component',
        ),
      },
      linkStrokeOpacity: {
        default: select(
          'Stroke opacity -- which if set -- removes normal chord pattern',
          {
            '100%': 1,
            '50%': 0.5,
            '25%': 0.25,
          },
          1,
          'Component',
        ),
      },
    },
    components: { ChordDiagram, ChartLegend },

    template: `
    <div id="story-container" style="width: 100%; height: 500px;">
    <chord-diagram :data="dataset" :innerRadius="innerRadius" :linkStrokeWidth="linkStrokeWidth">
      <chart-legend position="right"  />
    </chord-diagram>
    </div>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
