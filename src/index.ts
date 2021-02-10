import { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { Configuration as WebpackConfig } from 'webpack'
import type { Module } from '@nuxt/types'
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin'
import { requireNuxtVersion } from './compatibility'
import type { OptimisationArgs, Options } from './types'
import { webpackOptimiser, babelOptimiser, imageOptimiser, esbuildOptimiser, nuxtOptimiser } from './optimisations'

const buildOptimisationsModule: Module<Options> = function () {
  const { nuxt } = this
  const defaults = {
    measure: false,
    profile: 'experimental'
  } as Options
  const buildOptimisations = {
    ...defaults,
    ...nuxt.options.buildOptimisations
  } as Options

  // @ts-ignore
  requireNuxtVersion(nuxt?.constructor?.version, '2.10')

  nuxt.hook('build:before', () => {
    // if the user has enabled speed measure plugin and we can
    maybeEnableSpeedMeasurePlugin(buildOptimisations, nuxt)

    // @ts-ignore
    nuxtOptimiser({ options: buildOptimisations, nuxtOptions: nuxt.options, env: { isDev: nuxt.dev } })

    this.extendBuild((config: WebpackConfig, env: ExtendFunctionContext) => {
      const args = {
        nuxtOptions: nuxt.options,
        config,
        env,
        options: buildOptimisations
      } as OptimisationArgs
      const extendOptimisers = [
        webpackOptimiser, babelOptimiser, imageOptimiser, esbuildOptimiser
      ]
      for (const k in extendOptimisers) {
        // @ts-ignore
        extendOptimisers[k](args)
      }
    })
  })
}

/* Speed Measure Plugin: https://www.npmjs.com/package/speed-measure-webpack-plugin */
function maybeEnableSpeedMeasurePlugin (buildOptimisations : Options, nuxt : any) {
  if (!buildOptimisations.measure && !process.env.NUXT_MEASURE) {
    return
  }
  if (!nuxt.options.ssr) {
    // breaks if SSR is off for some reason
    console.warn('SpeedMeasurePlugin has been disabled because SSR mode is off.')
    return
  }
  if (process.env.NODE_ENV === 'test') {
    console.warn('SpeedMeasurePlugin has been disabled because of the testing environment.')
    return
  }
  const defaults = {
    outputFormat: 'human'
  }
  const measureOptions = {
    ...defaults,
    ...(typeof buildOptimisations.measure === 'boolean' ? {} : buildOptimisations.measure)
  } as SpeedMeasurePlugin.Options
  const smp = new SpeedMeasurePlugin(measureOptions)
  nuxt.hook('webpack:config', (configs: WebpackConfig[]) => {
    configs.forEach((config) => {
      if (config.name === 'client') {
        smp.wrap(config)
      }
    })
  })
}

// @ts-ignore
buildOptimisationsModule.meta = { name: 'nuxt-build-optimisations' }

export default buildOptimisationsModule
