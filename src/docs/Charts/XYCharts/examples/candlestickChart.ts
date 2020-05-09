import { XyChart, CandlestickSeries, ValueAxis, DateAxis, XyScrollbar, XyCursor } from '@/components'
import { select } from '@storybook/addon-knobs'
import { IApiConfig } from '@/components/composables/useData'

// const apiKey = process.env.ALPHA_VANTAGE
const apiKey = 'FM9CYB36R2532FMU'

export const candlestickChart = () => {
  function api(symbol: string = 'MSFT') {
    return [
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`,
      {
        offset: 'Time Series (Daily)',
        transform: (data: any) => {
          const output: any[] = []
          Object.keys(data).forEach(date => {
            output.push({ date, ...data[date] })
          })
          console.log('OUTPUT', output)
          return output
        },
      },
    ] as IApiConfig
  }

  return {
    data: () => ({
      tickers: {
        MSFT: api('MSFT'),
        AAPL: api('AAPL'),
        AAL: api('AAL'),
      },
    }),
    props: {
      ticker: {
        default: select('Ticker Symbol', { Microsoft: 'MSFT', Apple: 'AAPL', AmericanAirlines: 'AAL' }, 'MSFT'),
      },
    },
    components: { XyChart, ValueAxis, CandlestickSeries, DateAxis, XyScrollbar, XyCursor },
    template: `
    <xy-chart :url="tickers[ticker]">
      <date-axis dimension="x"/>
      <value-axis name="Prices" dimension="y" />
      <candlestick-series 
        name="Daily Price Movement"
        openningProp="open" 
        closingProp="close" 
        lowProp="low" 
        highProp="high"  
        dateProp="date"
      />
      <!-- 
      <xy-cursor />
      <xy-scrollbar axis="x" />
      -->
    </xy-chart>

  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
