import { ForceDirectedTree, ForceDirectedSeries } from '@/components'
import { select } from '@storybook/addon-knobs'

export const linkedNodes = () => {
  return {
    data: () => ({
      datasets: {
        dataset1: [
          {
            name: 'First',
            value: 1,
            link: ['Second'],
          },
          {
            name: 'Second',
            value: 1,
            link: ['Third'],
          },
          {
            name: 'Third',
            value: 1,
            link: ['First'],
          },
        ],
        dataset2: [
          {
            name: 'First',
            children: [
              {
                name: 'A1',
                children: [
                  {
                    name: 'A1-1',
                    value: 10,
                  },
                  {
                    name: 'A1-2',
                    value: 30,
                    link: ['A2-3'],
                  },
                  {
                    name: 'A1-3',
                    value: 20,
                    link: ['A3-2'],
                  },
                ],
              },
              {
                name: 'A2',
                children: [
                  {
                    name: 'A2-1',
                    value: 40,
                    link: ['A3-3'],
                  },
                  {
                    name: 'A2-2',
                    value: 30,
                  },
                  {
                    name: 'A2-3',
                    value: 10,
                  },
                ],
              },
              {
                name: 'A3',
                children: [
                  {
                    name: 'A3-1',
                    value: 5,
                  },
                  {
                    name: 'A3-2',
                    value: 20,
                  },
                  {
                    name: 'A3-3',
                    value: 20,
                  },
                ],
              },
            ],
          },
        ],
      },
    }),
    props: {
      dataset: {
        default: select(
          'Data set to model:',
          { 'Simple data set': 'dataset1', 'More complex': 'dataset2' },
          'dataset1',
        ),
      },
      linkOpacity: { default: select('link opacity', { 1: 1, '0.75': 0.75, '0.5': 0.5 }, 1) },
      linkWidth: { default: select('Column stroke width', { 0: 0, 1: 1, 3: 3, 5: 5, 8: 8 }, 3) },
    },
    components: { ForceDirectedTree, ForceDirectedSeries },

    template: `
    <force-directed-tree :data="datasets[dataset]" >
      <force-directed-series 
        idProp="name" 
        linkProp="link" 
        children="children"
        :linkOpacity="linkOpacity"
        :linkWidth="linkWidth"
      />
    </force-directed-tree>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
