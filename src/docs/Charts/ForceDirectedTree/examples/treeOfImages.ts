import { ForceDirectedTree, ForceDirectedSeries } from '@/components'

export const treeOfImages = () => {
  return {
    data: () => ({
      dataset: [
        {
          children: [
            {
              name: 'A1',
              value: 1,
              image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/icon_chrome.svg',
            },
            {
              name: 'A2',
              value: 1,
              image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/icon_firefox.svg',
            },
            {
              name: 'A3',
              value: 1,
              image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/icon_ie.svg',
            },
            {
              name: 'A4',
              value: 1,
              image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/icon_safari.svg',
            },
            {
              name: 'A5',
              value: 1,
              image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/icon_opera.svg',
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
      idProp="id" 
      valueProp="value" 
      nameProp="name" 
      childrenProp="children"
      imageProp="image"

      labelValign="bottom"
      labelFill="#000"
      labelDy=10

      fontSize=10
      minRadius=30
      maxRadius=30
      tooltipText="{name}: [bold]{value}[/bold]"

      centerStrength="0.2"
    />
    </force-directed-tree>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}

treeOfImages.story = {
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
  },
}
