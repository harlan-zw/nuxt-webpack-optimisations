import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader'
import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'
import webpack from 'webpack'

export default (profile: string | boolean, nuxt: any, config : WebpackConfig, { isDev, isServer } : ExtendFunctionContext) => {
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
      if (loader.includes('babel-loader') && isDev) {
        // @ts-ignore
        config.module.rules[ruleKey].use[useKey] = {
          loader: 'esbuild-loader',
          options: {
            target: 'chrome82',
            format: isServer ? 'cjs' : 'iife'
          }
        }
      } else if (loader.includes('ts-loader')) {
        if (isDev) {
          // remove ts-loader, esbuilder already transpiles for us
          // @ts-ignore
          config.module.rules[ruleKey].use.splice(useKey, 1)
        } else {
          // use esbuild for non-dev typescript
          // @ts-ignore
          config.module.rules[ruleKey].use[useKey] = {
            loader: 'esbuild-loader'
          }
        }
      }
    })
  })

  config.plugins.push(new ESBuildPlugin())
  if (profile === 'experimental') {
    // enable esbuild minifier, replace terser
    nuxt.options.build.minimize = true
    nuxt.options.build.minimizer = [
      new ESBuildMinifyPlugin({
        target: 'es2015'
      })
    ]
  }
}
