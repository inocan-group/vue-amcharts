import { GaugeChart, ValueAxis } from '../../index'
import { select, number } from '@storybook/addon-knobs'

export const simpleGauge = () => ({
  data: () => ({}),
  props: {
    innerRadius: {
      default: select(
        'the innerRadius of the gague chart',
        {
          None: 0,
          '-25 pixels': -25,
          '25 pixels': 25,
          '25 percent': '25%',
          '50 percent': '50%',
          '90 percent': '90%',
        },
        '25%',
        'Component',
      ),
    },
    startAngle: {
      default: number('startAngle', 180, {}, 'Component'),
    },
    endAngle: {
      default: number('endAngle', 360, {}, 'Component'),
    },
  },
  components: { GaugeChart, ValueAxis },
  template: `
    <div style="width: 70%; height: 300px">
        <gauge-chart :inner-radius="innerRadius" :start-angle="startAngle" :end-angle="endAngle" >
            <value-axis dimension="x" :min="0" :max="100" :strictMinMax="true" />
        </gauge-chart>
    </div>
  `,
})

simpleGauge.story = { parameters: { docs: { disable: true } } }
