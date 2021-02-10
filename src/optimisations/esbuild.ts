import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader'
import { OptimisationArgs } from '../types'

export default ({ options, nuxtOptions, config, env } : OptimisationArgs) => {
  if (!config.module || !config.plugins) {
    return
  }

  if (env.isDev) {
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
      if (rule.test.toString() === '/\\.m?jsx?$/i') {
        // Need to strip the thread-loader but keep the cache loader
        // @ts-ignore
        config.module.rules[ruleKey].use = [
          ...cacheLoader,
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2015'
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
              target: 'es2015'
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
              target: 'es2015'
            }
          }
        ]
      }
    })
    config.plugins.push(new ESBuildPlugin())
  }

  if (options.profile !== 'safe' && nuxtOptions.build.optimization) {
    // enable esbuild minifier, replace terser
    nuxtOptions.build.optimization.minimize = true
    nuxtOptions.build.optimization.minimizer = [
      new ESBuildMinifyPlugin({
        target: 'es2015'
      })
    ]
  }
}
