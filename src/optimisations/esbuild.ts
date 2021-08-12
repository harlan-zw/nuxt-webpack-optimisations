import { ESBuildMinifyPlugin } from 'esbuild-loader'
import { RuleSetUseItem } from 'webpack'
import { OptimisationArgs } from '../types'
import { RISK_PROFILE_SAFE } from '../constants'

export default (args: OptimisationArgs) => {
  const { options, nuxtOptions, config, env, logger } = args
  if (!config.module || !config.plugins)
    return

  // we replace the babel loader with esbuild
  if (options.features.esbuildLoader && env.isDev && options.profile !== RISK_PROFILE_SAFE) {
    const esbuildLoaderOptions = typeof options.esbuildLoaderOptions === 'function'
      ? options.esbuildLoaderOptions(args)
      : options.esbuildLoaderOptions

    // remove the nuxt js/ts loaders
    config.module.rules.map((rule) => {
      // nuxt js / ts file matching
      if (!rule.use || !Array.isArray(rule.use) || !rule.test)
        return rule

      const test = rule.test as RegExp
      const isTypescript = test.test('test.ts')
      const isJavascript = test.test('test.js')

      if (!isJavascript && !isTypescript)
        return rule

      // @ts-ignore
      const babelLoaderIndex = rule.use.findIndex((use: RuleSetUseItem) => use.loader.includes('babel-loader'))
      if (babelLoaderIndex === -1)
        return rule

      const esbuildLoader = {
        loader: 'esbuild-loader',
        options: {
          ...esbuildLoaderOptions,
        },
      }

      // in dev we swap out babel for js
      if (env.isDev && isJavascript) {
        rule.use.splice(babelLoaderIndex, 1, esbuildLoader)
        logger.debug(`JS compilation: swapped out babel-loader at index ${babelLoaderIndex} for esbuild`)
        return rule
      }

      // always swap out typescript builds
      esbuildLoader.options.loader = 'ts'
      rule.use.splice(babelLoaderIndex, 1, esbuildLoader)
      // @ts-ignore
      const tsLoaderIndex = rule.use.findIndex((use: RuleSetUseItem) => use.loader.includes('ts-loader'))
      
      // remove ts-loader only if present
      if (tsLoaderIndex !== -1) {
          rule.use.splice(tsLoaderIndex, 1)
          logger.debug(`TS compilation: swapped out ts-loader at index ${tsLoaderIndex} for esbuild`)
      }
      
      return rule
    })
  }

  // use esbuild to minify js
  if (options.features.esbuildMinifier && !env.isDev && options.profile !== RISK_PROFILE_SAFE && nuxtOptions.build.optimization) {
    const esbuildMinifyOptions = typeof options.esbuildMinifyOptions === 'function'
      ? options.esbuildMinifyOptions(args)
      : options.esbuildMinifyOptions
    // enable esbuild minifier, replace terser
    nuxtOptions.build.optimization.minimize = true
    nuxtOptions.build.optimization.minimizer = [
      new ESBuildMinifyPlugin(esbuildMinifyOptions),
    ]
    // make sure terser is off
    nuxtOptions.build.terser = false
    logger.debug('JS Minify: swapped out terser for esbuild minify')
  }
}
