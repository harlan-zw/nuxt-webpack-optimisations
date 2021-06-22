import type { Module } from '@nuxt/types'
import type { ExtendFunctionContext } from '@nuxt/types/config/module'
import defu from 'defu'
import { Configuration as WebpackConfiguration } from 'webpack'
import type { OptimisationArgs, ModuleOptions } from './types'
import { requireNuxtVersion } from './compatibility'
import speedMeasurePlugin from './tools/speed-measure-plugin'
import { webpackOptimiser, imageOptimiser, esbuildOptimiser, nuxtOptimiser } from './optimisations'
import logger from './logger'
import { NAME } from './constants'

const buildOptimisationsModule: Module<ModuleOptions> = async function(moduleOptions) {
  const { nuxt } = this

  requireNuxtVersion(nuxt.constructor.version, '2.10')

  const defaultConfig: ModuleOptions = {
    measure: false,
    measureMode: 'client',
    profile: 'experimental',
    esbuildMinifyOptions: {
      target: 'es2015',
    },
    esbuildLoaderOptions: {
      target: 'es2015',
    },
    features: {
      postcssNoPolyfills: true,
      esbuildLoader: true,
      esbuildMinifier: true,
      imageFileLoader: true,
      webpackOptimisations: true,
      cacheLoader: true,
      hardSourcePlugin: true,
      parallelPlugin: true,
    },
  }
  const options: ModuleOptions = defu.arrayFn(moduleOptions, nuxt.options.buildOptimisations, defaultConfig)

  // set measure based on env if the env is set
  if (typeof process.env.NUXT_MEASURE !== 'undefined')
    options.measure = process.env.NUXT_MEASURE.toLowerCase() === 'true'

  await nuxt.callHook('buildOptimisations:options', options)
  logger.debug('post `buildOptimisations:options` hook options', options)

  nuxt.hook('build:before', (nuxt: any) => {
    const args = {
      options,
      nuxtOptions: nuxt.options,
      env: { isDev: nuxt.dev || process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev' },
    } as OptimisationArgs

    if (process.env.NODE_ENV !== 'test' && options.profile)
      logger.info(`\`${NAME}\` enabled with \`${options.profile}\` profile.`)

    // boot speed measure plugin
    speedMeasurePlugin(args, nuxt)
    // if profile is false we don't add any optimisations
    if (!options.profile) {
      logger.info(`\`${NAME}\` is disabled because the profile is ${options.profile}.`)
      return
    }

    nuxtOptimiser(args)

    this.extendBuild((config: WebpackConfiguration, ctx: ExtendFunctionContext) => {
      args.env = ctx
      args.config = config
      args.logger = logger.withScope(ctx.isModern ? 'modern' : (ctx.isClient ? 'client' : 'server'))
      // call all of them
      webpackOptimiser(args)
      imageOptimiser(args)
      esbuildOptimiser(args)
    })
  })
}

// @ts-ignore
buildOptimisationsModule.meta = { name: NAME }

export default buildOptimisationsModule
