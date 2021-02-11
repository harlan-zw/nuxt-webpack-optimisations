import { OptimisationArgs } from '../types'

export default ({ config, env, options } : OptimisationArgs) => {
  if (!config.resolve || !config.output || !config.optimization || !options.features.webpackOptimisations) {
    return
  }
  /* Webpack Optimisations: https://webpack.js.org/guides/build-performance/ */
  config.output.pathinfo = false
  config.output.futureEmitAssets = true
  config.resolve.symlinks = false
  config.resolve.cacheWithContext = false
  if (env.isDev) {
    config.optimization.removeAvailableModules = false
    config.optimization.removeEmptyChunks = false
    config.optimization.splitChunks = false
    config.optimization.runtimeChunk = false
  }
}
