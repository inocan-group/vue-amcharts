import { XyChart, ColumnSeries, ValueAxis, DateAxis } from '../index'
import { text, select, boolean, array } from '@storybook/addon-knobs'
import { addDays, subDays, format } from 'date-fns'
import { wait } from 'common-types'
import { Ref, ref } from '@vue/composition-api'

function d(d: Date) {
  return format(d, 'yyyy-MM-dd')
}

function r() {
  return Math.floor(Math.random() * 100)
}

let dataStream: Array<{ date: string; price: number }> = []
const dataStream2: Ref<Array<{ date: string; price: number }>> = ref([])

async function cycleData() {
  const date = subDays(new Date(), 7)
  let current = d(subDays(new Date(), 7))

  for await (const [i] of Array(7).entries()) {
    dataStream = dataStream.concat({ date: current, price: r() })
    // dataStream.push({ date: current, price: r() })
    dataStream2.value.push({ date: current, price: r() })
    await wait(1500)
    console.log('adding', dataStream)
    current = d(addDays(date, 1))
  }

  current = d(subDays(new Date(), 7))
  for await (const [i] of Array(7).entries()) {
    dataStream = dataStream.map(data => (data.date === current ? { ...data, price: r() } : data))
    dataStream2.value = dataStream2.value.map(data => (data.date === current ? { ...data, price: r() } : data))
    await wait(1500)
    console.log('updating', dataStream)
    current = d(addDays(date, 1))
  }
}

cycleData()

export const columnChart = () => {
  return {
    data() {
      return {
        dataStream,
      }
    },
    components: { XyChart, ValueAxis, ColumnSeries, DateAxis },

    template: `
    <xy-chart :data="dataStream">
      <date-axis dimension="x"/>
      <value-axis dimension="y" />
      <column-series  xProp="date" yProp="price" />
    </xy-chart>
  `,
    notes: `Shows animation of data in a very simple container`,
  }
}
