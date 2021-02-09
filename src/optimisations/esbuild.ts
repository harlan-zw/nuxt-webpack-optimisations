import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader'
import webpack from 'webpack'
import { OptimisationArgs } from '../types'

export default ({ options, nuxt, config, env } : OptimisationArgs) => {
  if (!config.module || !config.plugins) {
    return
  }

  // remove the nuxt js/ts loaders
  config.module.rules.forEach((rule, ruleKey) => {
    if (rule.test && rule.test.toString() !== '/\\.m?jsx?$/i' &&
      rule.test.toString() !== '/\\.ts$/i' &&
      rule.test.toString() !== '/\\.tsx$/i') {
      return
    }
    if (!rule.use) {
      return
    }
    // iterate through the loaders, find the babel one
    // @ts-ignore
    rule.use.forEach((use : webpack.RuleSetRule, useKey : number) => {
      const loader = use.loader as String
      if (loader.includes('babel-loader') && env.isDev) {
        // @ts-ignore
        config.module.rules[ruleKey].use[useKey] = {
          loader: 'esbuild-loader',
          options: {
            target: 'es2015',
            format: env.isServer ? 'cjs' : 'iife'
          }
        }
      }
    })
  })

  config.plugins.push(new ESBuildPlugin())
  if (options.profile === 'experimental') {
    // enable esbuild minifier, replace terser
    nuxt.options.build.minimize = true
    nuxt.options.build.minimizer = [
      new ESBuildMinifyPlugin({
        target: 'es2015'
      })
    ]
  }
}
