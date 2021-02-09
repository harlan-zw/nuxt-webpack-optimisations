import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'

export default (config : WebpackConfig, { isDev } : ExtendFunctionContext) => {
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
  if (config.optimization && isDev) {
    config.optimization.removeAvailableModules = false
    config.optimization.removeEmptyChunks = false
    config.optimization.splitChunks = false
    config.optimization.runtimeChunk = false
  }
}
