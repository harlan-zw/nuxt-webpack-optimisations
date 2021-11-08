import { extendWebpackConfig, isNuxt2 } from '@nuxt/kit'
import { defineAugmentation } from '../core/util'

export default defineAugmentation(({ nuxt, dev }) => ({

  featureKey: 'webpackOptimisations',

  setup() {
    /* Webpack Optimisations: https://webpack.js.org/guides/build-performance/ */
    extendWebpackConfig((config) => {
      if (!config.output || !config.resolve || !config.optimization)
        return

      config.output.pathinfo = false
      if (isNuxt2(nuxt))
        config.output.futureEmitAssets = true

      config.resolve.cacheWithContext = false
      if (dev) {
        config.optimization.removeAvailableModules = false
        config.optimization.removeEmptyChunks = false
        config.optimization.splitChunks = false
        config.optimization.runtimeChunk = false
      }
    })
  },
}))
