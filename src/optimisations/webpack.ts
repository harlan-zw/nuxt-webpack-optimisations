import { OptimisationArgs } from '../types'

export default ({ config, env } : OptimisationArgs) => {
  if (!config.resolve || !config.output || !config.optimization) {
    return
  }
  /* Webpack Optimisations: https://webpack.js.org/guides/build-performance/ */
  if (config.output) {
    config.output.pathinfo = false
    config.output.futureEmitAssets = true
  }
  if (config.resolve) {
    config.resolve.symlinks = false
    config.resolve.cacheWithContext = false
  }
  if (config.optimization && env.isDev) {
    config.optimization.removeAvailableModules = false
    config.optimization.removeEmptyChunks = false
    config.optimization.splitChunks = false
    config.optimization.runtimeChunk = false
  }
}
