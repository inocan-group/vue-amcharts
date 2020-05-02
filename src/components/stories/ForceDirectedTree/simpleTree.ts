import { ForceDirectedTree, ForceDirectedSeries } from '../../index'

export const simpleTree = () => {
  return {
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
          name: 'Forth',
          value: 732,
        },
        {
          name: 'Fifth',
          value: 835,
        },
      ],
    }),
    props: {},
    components: { ForceDirectedTree, ForceDirectedSeries },

    template: `
    <force-directed-tree :data="dataset" >
      <force-directed-series idProp="name" valueProp="value" nameProp="name" />
    </force-directed-tree>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
