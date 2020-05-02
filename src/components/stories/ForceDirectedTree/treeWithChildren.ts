import { ForceDirectedTree, ForceDirectedSeries } from '../../index'

export const treeWithChildren = () => {
  return {
    data: () => ({
      dataset: [
        {
          name: 'First',
          children: [
            {
              name: 'A1',
              value: 100,
            },
            {
              name: 'A2',
              value: 60,
            },
            {
              name: 'A3',
              value: 30,
            },
          ],
        },
        {
          name: 'Second',
          children: [
            {
              name: 'B1',
              value: 135,
            },
            {
              name: 'B2',
              value: 98,
            },
            {
              name: 'B3',
              value: 56,
            },
          ],
        },
        {
          name: 'Third',
          children: [
            {
              name: 'C1',
              value: 335,
            },
            {
              name: 'C2',
              value: 148,
            },
            {
              name: 'C3',
              value: 126,
            },
            {
              name: 'C4',
              value: 26,
            },
          ],
        },
        {
          name: 'Fourth',
          children: [
            {
              name: 'D1',
              value: 415,
            },
            {
              name: 'D2',
              value: 148,
            },
            {
              name: 'D3',
              value: 89,
            },
            {
              name: 'D4',
              value: 64,
            },
            {
              name: 'D5',
              value: 16,
            },
          ],
        },
        {
          name: 'Fifth',
          children: [
            {
              name: 'E1',
              value: 687,
            },
            {
              name: 'E2',
              value: 148,
            },
          ],
        },
      ],
    }),
    props: {},
    components: { ForceDirectedTree, ForceDirectedSeries },

    template: `
    <force-directed-tree :data="dataset" >
      <force-directed-series 
        valueProp="value" 
        nameProp="name" 
        childrenProp="children" 
        centerStrength="0.5" 
      />
    </force-directed-tree>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
