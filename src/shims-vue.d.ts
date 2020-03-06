declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'rough-viz'
declare module 'plotly.js-dist' {
  import { Root, Frame } from 'plotly.js'
  export * from 'plotly.js'
  interface AnimationAttributes {
    transition: {
      duration: number
      easing: string
    }
    frame: {
      duration: number
    }
  }

  export function animate(
    root: Root,
    frame: Partial<Frame> | Partial<Frame>[],
    AnimationAttributes: AnimationAttributes,
  ): Promise<undefined>
}
