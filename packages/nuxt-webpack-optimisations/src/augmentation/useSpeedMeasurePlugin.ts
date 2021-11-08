import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { extendWebpackConfig } from '@nuxt/kit'
import { defineAugmentation, deny } from '../core/util'

/**
 * Register Speed Measure Plugin: https://www.npmjs.com/package/speed-measure-webpack-plugin
 */
export default defineAugmentation(({ logger, options, dev, nuxt }) => ({

  dev: true,

  policy() {
    if (!options.measure)
      return deny('measure not enabled')
    if (!nuxt.options.ssr) {
      options.measure = false
      return deny('SSR mode is off')
    }
    // running in test mode does not seem like a good idea
    if (process.env.NODE_ENV === 'test') {
      options.measure = false
      return deny('testing environmen')
    }
    return dev
  },

  setup() {
    const defaults = {
      outputFormat: 'human',
    }
    const measureOptions = {
      ...defaults,
      ...(typeof options.measure === 'boolean' ? {} : options.measure),
    } as SpeedMeasurePlugin.Options
    const smp = new SpeedMeasurePlugin(measureOptions)

    extendWebpackConfig((config) => {
      if (config.name === options.measureMode || options.measureMode === 'all') {
        // @ts-ignore
        smp.wrap(config)
        logger.info(`SpeedMeasurePlugin is enabled for \`${config.name}\`. Build time may be effected.`)
      }
    })
  },
}))
