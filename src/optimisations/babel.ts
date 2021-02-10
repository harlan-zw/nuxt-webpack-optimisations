import { OptimisationArgs } from '../types'

export default ({ nuxtOptions } : OptimisationArgs) => {
  // @ts-ignore
  nuxtOptions.build.babel.presets = ({ isServer }, [, options]) => {
    if (!isServer) {
      // @ts-ignore
      options.targets = '> 0.5%, last 2 versions, Firefox ESR, not dead'
    }
  }
}
