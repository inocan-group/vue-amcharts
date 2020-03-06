import XYChart from './XYChart.vue'
import ConsumerPriceIndex from './ConsumerPriceIndex.vue'
import { text } from '@storybook/addon-knobs'

export default { title: 'amCharts/Line Charts' }

export const basicExample = () => ({
  components: { XYChart },
  template: '<x-y-chart/>',
})

export const CPIWithKnobs = () => ({
  components: { ConsumerPriceIndex },
  props: {
    title: { default: text('Text', 'Consumer Price Index') },
  },
  template: '<consumer-price-index :title="title" >A footer like no other</consumer-price-index>',
})
