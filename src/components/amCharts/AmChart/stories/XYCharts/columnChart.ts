import { XyChart, ColumnSeries, ValueAxis, DateAxis } from '../../index'
import { text, select, boolean, array, number } from '@storybook/addon-knobs'
import { format } from 'date-fns'
import { IDictionary } from 'common-types'

function d(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

function r() {
  return Math.floor(Math.random() * 100)
}

type PricePoint = { date: string; price: number }

console.log('calculating datasets')

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

const data = {
  basic,
  plus,
  alt,
}

// const data = [ basic, plus, alt ]
export const columnChart = () => {
  return {
    props: {
      stroke: { default: select('stroke color', { blue: '#69B7DC', red: '#ff0000' }, '#69B7DC') },
      strokeWidth: { default: select('Column stroke width', { 0: 0, 1: 1, 3: 3, 5: 5, 8: 8 }, 3) },
      fill: { default: select('fill color', { blue: '#69B7DC', red: '#ff0000' }, '#69B7DC') },
      dataset: {
        default: select('data set', data as any, (data as IDictionary).basic),
      },
    },
    components: { XyChart, ValueAxis, ColumnSeries, DateAxis },

    template: `
    <xy-chart :data="dataset">
      <date-axis dimension="x"/>
      <value-axis dimension="y" />
      <column-series xProp="date" yProp="price" :stroke="stroke" :fill="fill" :strokeWidth="strokeWidth" />
    </xy-chart>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
