import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader'
import { OptimisationArgs } from '../types'

export default ({ options, nuxtOptions, config, env } : OptimisationArgs) => {

  if (!config.module || !config.plugins) {
    return
  }

  if (options.features.esbuildLoader && (env.isDev || options.profile !== 'safe')) {
    let cacheLoader = []
    // remove the nuxt js/ts loaders
    config.module.rules.forEach((rule, ruleKey) => {
      // nuxt js / ts file matching
      if (!rule.use || !rule.test) {
        return
      }
      // @ts-ignore
      cacheLoader = config.module.rules[ruleKey].use.filter((use) => {
        return use.loader.includes('cache-loader')
      })
      if (env.isDev && rule.test.toString() === '/\\.m?jsx?$/i') {
        // Need to strip the thread-loader but keep the cache loader
        // @ts-ignore
        config.module.rules[ruleKey].use = [
          ...cacheLoader,
          {
            loader: 'esbuild-loader',
            options: {
              ...options.esbuildLoaderOptions
            }
          }
        ]
      } else if (rule.test.toString() === '/\\.ts$/i') {
        // @ts-ignore
        config.module.rules[ruleKey].use = [
          ...cacheLoader,
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              ...options.esbuildLoaderOptions
            }
          }
        ]
      } else if (rule.test.toString() === '/\\.tsx$/i') {
        // @ts-ignore
        config.module.rules[ruleKey].use = [
          ...cacheLoader,
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'ts',
              ...options.esbuildLoaderOptions
            }
          }
        ]
      }
    })
  }

  if (options.features.esbuildMinifier && !env.isDev && options.profile !== 'safe' && nuxtOptions.build.optimization) {
    // enable esbuild minifier, replace terser
    nuxtOptions.build.optimization.minimize = true
    nuxtOptions.build.optimization.minimizer = [
      new ESBuildMinifyPlugin(options.esbuildMinifyOptions)
    ]
    // make sure terser is off
    nuxtOptions.build.terser = false
  }
  config.plugins.push(new ESBuildPlugin())
}
