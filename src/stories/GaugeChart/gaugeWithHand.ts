import { GaugeChart, ValueAxis, ClockHand } from '@/components'
import { select, number, boolean } from '@storybook/addon-knobs'

export const gaugeWithHand = () => ({
  data: () => ({
    innerRadius: '90%',
    startAngle: 180,
    endAngle: 360,
  }),
  props: {
    value: {
      default: number(
        'clock hand value',
        60,
        {
          min: 0,
          max: 100,
        },
        'Component',
      ),
    },
    fill: {
      default: select(
        'hand fill',
        {
          red: 'red',
          blue: 'blue',
          green: 'green',
        },
        'red',
        'Component',
      ),
    },
    stroke: {
      default: select(
        'hand stroke',
        {
          red: 'red',
          green: 'green',
          blue: 'blue',
        },
        'red',
        'Component',
      ),
    },
    handInnerRadius: {
      default: number(
        'hand inner radius',
        0,
        {
          step: 10,
          min: 0,
          max: 100,
        },
        'Component',
      ),
    },
    handRadius: {
      default: number(
        'hand radius',
        100,
        {
          step: 10,
          min: 0,
          max: 100,
        },
        'Component',
      ),
    },
    startWidth: {
      default: number(
        'hand start width',
        5,
        {
          min: 0,
        },
        'Component',
      ),
    },
    endWidth: {
      default: number(
        'hand end width',
        1,
        {
          min: 0,
        },
        'Component',
      ),
    },
    disablePin: {
      default: boolean('disable pin', false, 'Component'),
    },
    disableHand: {
      default: boolean('disable hand', false, 'Component'),
    },
  },
  components: { GaugeChart, ValueAxis, ClockHand },
  template: `
    <div style="width: 70%; height: 300px">
        <gauge-chart :inner-radius="innerRadius" :start-angle="startAngle" :end-angle="endAngle" >
            <value-axis :min="0" :max="100" :strictMinMax="true" />
            <clock-hand
            :disable-pin="disablePin"
            :disable-hand="disableHand"
            :value="value"
            :fill="fill"
            :stroke="stroke"
            :inner-radius="handInnerRadius"
            :radius="handRadius"
            :start-width="startWidth"
            :end-width="endWidth"
            />
        </gauge-chart>
    </div>
  `,
})

gaugeWithHand.story = {
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
  },
}
