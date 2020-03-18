interface IAnimationAttributes {
  transition: {
    duration: number
    easing: string
  }
  frame: {
    duration: number
  }
}

declare module 'plotly.js-dist' {
  import { Root, Frame } from 'plotly.js'
  export * from 'plotly.js'

  export function animate(
    root: Root,
    frame: Partial<Frame> | Partial<Frame>[],
    AnimationAttributes: IAnimationAttributes,
  ): Promise<undefined>
}
