import type { Module } from '@nuxt/types'
import type { ExtendFunctionContext } from '@nuxt/types/config/module'
import type { Configuration as WebpackConfig } from 'webpack'
import type { OptimisationArgs, ModuleOptions } from './types'
import { requireNuxtVersion } from './compatibility'
import speedMeasurePlugin from './tools/speed-measure-plugin'
import { webpackOptimiser, imageOptimiser, esbuildOptimiser, nuxtOptimiser } from './optimisations'

const buildOptimisationsModule: Module<ModuleOptions> = function () {
  const { nuxt } = this
  const defaults = {
    measure: false,
    measureMode: 'client',
    profile: 'experimental',
    esbuildMinifyOptions: {
      target: 'es2015'
    },
    esbuildLoaderOptions: {
      target: 'es2015'
    },
    features: {
      esbuildLoader: true,
      esbuildMinifier: true,
      imageFileLoader: true,
      webpackOptimisations: true,
      cacheLoader: true,
      hardSourcePlugin: true
    }
  } as ModuleOptions
  const buildOptimisations = {
    ...defaults,
    ...nuxt.options.buildOptimisations
  } as ModuleOptions

  requireNuxtVersion(nuxt.constructor.version, '2.10')

  // set measure based on env if the env is set
  if (typeof process.env.NUXT_MEASURE !== 'undefined') {
    buildOptimisations.measure = process.env.NUXT_MEASURE.toLowerCase() === 'true'
  }

  nuxt.hook('build:before', () => {
    const args = {
      options: buildOptimisations,
      nuxtOptions: nuxt.options,
      env: { isDev: nuxt.dev || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev' }
    } as OptimisationArgs
    // if the user has enabled speed measure plugin and we can
    speedMeasurePlugin(args, nuxt)
    // if profile is false we don't add any optimisations
    if (buildOptimisations.profile === false) {
      return
    }
    if (process.env.NODE_ENV !== 'test') {
      console.info(`\`nuxt-build-optimisations\` enabled with \`${buildOptimisations.profile}\` profile.`)
    }
    // @ts-ignore
    nuxtOptimiser(args)

    this.extendBuild((config: WebpackConfig, env: ExtendFunctionContext) => {
      args.env = env
      args.config = config
      const extendOptimisers = [
        webpackOptimiser, imageOptimiser, esbuildOptimiser
      ]
      for (const k in extendOptimisers) {
        extendOptimisers[k](args)
      }
    })
  })
}

// @ts-ignore
buildOptimisationsModule.meta = { name: 'nuxt-build-optimisations' }

export default buildOptimisationsModule
