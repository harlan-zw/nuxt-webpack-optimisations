import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { extendWebpackConfig, isNuxt3 } from '@nuxt/kit-edge'
import { defineAugmentation, deny } from '../core/util'

export default defineAugmentation(({ logger, name, options, nuxt }) => ({

  featureKey: 'esbuildMinifier',
  dev: false,
  policy() {
    if (isNuxt3(nuxt))
      deny('n/a in nuxt3')
  },

  setup() {
    // make sure terser is off
    nuxt.options.build.terser = false
    extendWebpackConfig((config) => {
      logger.debug(`\`${name}:${config.name}\` Swapping TerserPlugin for ESBuildMinifyPlugin.`)
      config.optimization!.minimizer = [
        // @ts-ignore
        new ESBuildMinifyPlugin(options.esbuildMinifyOptions[config.name]),
      ]
    })
  },
}))
