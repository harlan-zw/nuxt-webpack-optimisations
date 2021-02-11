import { OptimisationArgs } from '../types'

export default ({ nuxtOptions, options } : OptimisationArgs) => {
  // if user disables this feature
  if (!options.features.babelNotDead) {
    return
  }
  // @ts-ignore
  nuxtOptions.build.babel.presets = ({ isServer }, [, options]) => {
    if (!isServer) {
      // @ts-ignore
      options.targets = '> 0.5%, last 2 versions, Firefox ESR, not dead'
    }
  }
}
