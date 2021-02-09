import { ESBuildPlugin, ESBuildMinifyPlugin } from 'esbuild-loader'
import type { Configuration as WebpackConfig } from 'webpack'
import { ExtendFunctionContext } from '@nuxt/types/config/module'
import webpack from 'webpack'

export default (profile: string | boolean, nuxt: any, config : WebpackConfig, { isDev } : ExtendFunctionContext) => {
  if (!config.module || !config.plugins) {
    return
  }
  if (isDev) {
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
        // @ts-ignore
        if (!use.loader || !use.loader.includes('babel-loader')) {
          return
        }
        // @ts-ignore
        config.module.rules[ruleKey].use[useKey] = {
          loader: 'esbuild-loader',
          options: {
            target: 'chrome82'
          }
        }
      })
    })

    config.plugins.push(new ESBuildPlugin())
  } else if (profile === 'experimental') {
    // enable esbuild minifier, replace terser
    nuxt.options.build.terser = false
    nuxt.options.build.minimize = true
    nuxt.options.build.minimizer = [
      new ESBuildMinifyPlugin({
        target: 'es2015'
      })
    ]
  }
}
