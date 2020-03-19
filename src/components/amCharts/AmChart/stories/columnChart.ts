import { XyChart, ColumnSeries, ValueAxis, DateAxis } from '../index'
import { text, select, boolean, array, number } from '@storybook/addon-knobs'
import { addDays, subDays, format } from 'date-fns'
import { wait, IDictionary } from 'common-types'
import { Ref, ref } from '@vue/composition-api'

function d(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

function r() {
  return Math.floor(Math.random() * 100)
}

const datasets = () => {
  const basic: Array<{ price: number; date: string }> = []
  const plus: Array<{ price: number; date: string }> = []
  const alt: Array<{ price: number; date: string }> = []
  const date = (offset: number) => `2020-03-${10 + offset}`
  for (const [i] of Array(6).entries()) {
    const basicPrice = r()
    const altPrice = r()
    basic.push({ date: date(i), price: basicPrice })
    plus.push({ date: date(i), price: basicPrice })
    alt.push({ date: date(i), price: altPrice })
  }
  plus.push({ date: date(7), price: r() })

  return {
    basic,
    plus,
    alt,
  }
}

export const columnChart = () => {
  const datasets = () => {
    const basic: Array<IDictionary> = []
    const plus: Array<IDictionary> = []
    const alt: Array<IDictionary> = []
    const date = (offset: number) => `2020-03-${10 + offset}`
    for (const [i] of Array(6).entries()) {
      const basicPrice = r()
      const altPrice = r()
      basic.push({ date: date(i), price: basicPrice })
      plus.push({ date: date(i), price: basicPrice })
      alt.push({ date: date(i), price: altPrice })
    }
    plus.push({ date: date(6), price: r() })

    return {
      basic,
      plus,
      alt,
    }
  }

  return {
    // data() {
    //   let dataStream: Array<{ date: string; price: number }> = []
    //   const dataStream2: Ref<Array<{ date: string; price: number }>> = ref([])
    //   async function cycleData() {
    //     const date = subDays(new Date(), 7)
    //     let current = d(subDays(new Date(), 7))

    //     for await (const [i] of Array(7).entries()) {
    //       // dataStream = dataStream.concat({ date: current, price: r() })
    //       dataStream.push({ date: current, price: r() })
    //       dataStream2.value.push({ date: current, price: r() })
    //       await wait(1500)
    //       console.log(`adding ${current}`, dataStream)
    //       current = format(addDays(new Date(current), 2), 'yyyy-MM-dd')
    //     }

    //     current = d(subDays(new Date(), 7))
    //     for await (const [i] of Array(7).entries()) {
    //       // dataStream = dataStream.map(data => (data.date === current ? { ...data, price: r() } : data))
    //       dataStream = dataStream.map(data => (data.date === current ? { ...data, price: r() } : data))
    //       dataStream2.value = dataStream2.value.map(data => (data.date === current ? { ...data, price: r() } : data))
    //       await wait(1500)
    //       console.log(`updating ${current}`, dataStream)
    //       current = format(addDays(new Date(current), 2), 'yyyy-MM-dd')
    //     }
    //   }
    //   cycleData()

    //   return {
    //     dataStream: dataStream,
    //   }
    // },
    props: {
      stroke: { default: select('stroke color', { blue: '#69B7DC', red: '#ff0000' }, '#69B7DC') },
      fill: { default: select('fill color', { blue: '#69B7DC', red: '#ff0000' }, '#69B7DC') },
      dataset: {
        default: select('data set', datasets(), 'basic'),
      },
    },
    components: { XyChart, ValueAxis, ColumnSeries, DateAxis },

    template: `
    <xy-chart :data="dataset">
      <date-axis dimension="x"/>
      <value-axis dimension="y" />
      <column-series xProp="date" yProp="price" :stroke="stroke" :fill="fill" />
    </xy-chart>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
