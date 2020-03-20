import { XyChart, CandlestickSeries, ValueAxis, DateAxis, XyScrollbar, ChartCursor } from '../../index'
import { text, select, boolean, array, number } from '@storybook/addon-knobs'
import { IApiConfig } from '../../shared/api'

function r(min: number = 1, max: number = 100) {
  return Math.floor(Math.random() * (max - min)) + min
}

const apiKey = process.env.ALPHA_VANTAGE

export const candlestickChart = () => {
  const api = (symbol: string = 'MSFT') =>
    [
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`,
      {
        offset: 'Time Series (Daily)',
        transform: (data: any) => {
          const output: any[] = []
          Object.keys(data).forEach(date => {
            output.push({ date, ...data[date] })
          })
          return output
        },
      },
    ] as IApiConfig

  const tickers = {
    msft: api('MSFT'),
    aapl: api('AAPL'),
    aal: api('AAL'),
  }

  return {
    props: {
      ticker: {
        default: select(
          'Ticker Symbol',
          { Microsoft: tickers.msft, Apple: tickers.aapl, AmericanAirlines: tickers.aal } as any,
          tickers.msft as any,
        ),
      },
    },
    components: { XyChart, ValueAxis, CandlestickSeries, DateAxis, XyScrollbar, ChartCursor },
    template: `
    <xy-chart>
      <date-axis dimension="x"/>
      <value-axis name="Prices" dimension="y" />
      <candlestick-series 
        name="Daily Price Movement"
        :url="ticker"
        openningProp="1. open" 
        closingProp="4. close" 
        lowProp="3. low" 
        highProp="2. high"  
        dateProp="date"
      />
      <chart-cursor />
      <xy-scrollbar axis="x" />
    </xy-chart>

  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}
