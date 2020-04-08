import { IDictionary } from 'common-types'
import { select } from '@storybook/addon-knobs'
import { default as StoryContainer } from './StoryContainer.vue'

const CONTAINER_DATA = {
  containerStyle: (width: string, height: string) => {
    return `width: ${width}; height: ${height};`
  },
}

const CONTAINER_PROPS = {
  containerWidth: {
    default: select('Width of the container', { '100%': '100%', '500px': '500px', '50%': '50%' }, '100%', 'Container'),
  },
  containerHeight: {
    default: select(
      'Height of the container',
      { '800px': '800px', '500px': '500px', '300px': '300px' },
      '500px',
      'Container',
    ),
  },
}

export function storyContainer(story: IDictionary) {
  // components
  story.components = story.components ? { ...story.components, ...{ StoryContainer } } : { StoryContainer }
  // props
  story.props = story.props ? { ...story.props, ...CONTAINER_PROPS } : CONTAINER_PROPS
  // template
  story.template = `
<story-container :width="containerWidth" :height="containerHeight" >
  ${story.template}
</story-container>`

  console.log('story is', JSON.stringify(story, null, 2))

  return story
}
