import { WordCloud, WordSeries } from '../../index'
import { select, text, array, number } from '@storybook/addon-knobs'

export const simpleWordCloud = () => {
  return {
    props: {
      words: {
        default: text(
          'Words for word cloud',
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
          'Component',
        ),
      },
      excludeWords: {
        default: array('Exclude words', ['the', 'an', 'to'], undefined, 'Component'),
      },
      minWordLength: {
        default: number('Minimum word length', 2, {}, 'Component'),
      },
      minFontSize: {
        default: select(
          'Minimum font size (% or #)',
          { '2%': '2%', '4%': '4%', '8 as string': '8', '8 as number': 8 },
          '2%',
          'Component',
        ),
      },
      maxFontSize: {
        default: select(
          'Maximum font size (% or #)',
          { '20%': '20%', '40%': '40%', '36 as string': '36', '36 as number': 36 },
          '20%',
          'Component',
        ),
      },
    },
    components: { WordCloud, WordSeries },

    template: `
    <word-cloud  >
      <word-series :text="words" :min-font-size="minFontSize" :max-font-size="maxFontSize" />
    </word-cloud>
  `,
    notes: `Shows animation of data in a very simple container; highlighting add, update, and remove`,
  }
}
