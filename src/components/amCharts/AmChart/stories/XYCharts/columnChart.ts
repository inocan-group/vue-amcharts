import { XyChart, ColumnSeries, ValueAxis, DateAxis } from '../../index'
import { select, boolean } from '@storybook/addon-knobs'
import { format } from 'date-fns'

function d(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

function r() {
  return Math.floor(Math.random() * 100)
}

type PricePoint = { date: string; price: number }

const basic: PricePoint[] = []
const plus: PricePoint[] = []
const alt: PricePoint[] = []
const date = (offset: number) => `2020-03-${10 + offset}`
for (const [i] of Array(6).entries()) {
  const basicPrice = r()
  const altPrice = r()
  basic.push({ date: date(i), price: basicPrice } as PricePoint)
  plus.push({ date: date(i), price: basicPrice } as PricePoint)
  alt.push({ date: date(i), price: altPrice } as PricePoint)
}
plus.push({ date: date(6), price: r() } as PricePoint)

export const columnChart = () => {
  return {
    data: () => ({
      dataset: {
        basic,
        plus,
        alt,
        none: [],
      },
    }),
    props: {
      stroke: { default: select('stroke color', { blue: '#69B7DC', red: '#ff0000' }, '#69B7DC') },
      strokeWidth: { default: select('Column stroke width', { 0: 0, 1: 1, 3: 3, 5: 5, 8: 8 }, 3) },
      fill: { default: select('fill color', { blue: '#69B7DC', red: '#ff0000' }, '#69B7DC') },
      datachoice: {
        default: select('Dataset', { none: 'none', basic: 'basic', alt: 'alt', basicPlus: 'plus' }, 'basic'),
      },
      fixPriceAxis: {
        default: boolean(`Fix axis's price range [0-100]`, false),
      },
    },
    components: { XyChart, ValueAxis, ColumnSeries, DateAxis },

    template: `
    <xy-chart :data="dataset[datachoice]" dataIdProp="date" dataProperties="price">
      <date-axis dimension="x"/>
      <value-axis 
        name="Price" 
        dimension="y" 
        :min="fixPriceAxis ? 0 : -1" 
        :max="fixPriceAxis ? 100 : -1" 
      />
      <column-series 
        xProp="date" 
        yProp="price" 
        :stroke="stroke" 
        :fill="fill" 
        :strokeWidth="strokeWidth" 
      />
    </xy-chart>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
