import { XyChart, ColumnSeries, ValueAxis, DateAxis } from '../index'
import { text, select, boolean, array } from '@storybook/addon-knobs'
import { subDays } from 'date-fns'

function cycleData() {
  const aWeekAgo = 
}

export const columnChart = () => {
  return {
    data() {
      return {
        dataStream: [
          { date: '2020-03-12', price: 34 },
          { date: '2020-03-13', price: 23 },
        ],
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

