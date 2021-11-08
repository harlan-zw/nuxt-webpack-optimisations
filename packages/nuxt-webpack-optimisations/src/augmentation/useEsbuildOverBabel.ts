import { RuleSetUseItem } from 'webpack'
import { extendWebpackConfig, isNuxt3 } from '@nuxt/kit'
import { defineAugmentation, deny } from '../core/util'

export default defineAugmentation(({ name, logger, nuxt, options, dev }) => ({

  featureKey: 'esbuildLoader',
  dev: true,

  policy() {
    if (isNuxt3(nuxt))
      deny('nuxt3 comes with esbuild')
  },

  setup() {
    extendWebpackConfig((config) => {
      // remove the nuxt js/ts loaders
      config.module!.rules.map((rule) => {
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
            loader: 'js',
            // @ts-ignore
            ...options.esbuildLoaderOptions[config.name],
          },
        }

        // in dev we swap out babel for js
        if (dev && isJavascript) {
          logger.debug(`\`${name}:${config.name}\` Swapping babel-loader for esbuild-loader for ${rule.test}.`)
          rule.use.splice(babelLoaderIndex, 1, esbuildLoader)
          return rule
        }

        // always swap out typescript builds
        esbuildLoader.options.loader = 'ts'
        rule.use.splice(babelLoaderIndex, 1, esbuildLoader)
        // @ts-ignore
        const tsLoaderIndex = rule.use.findIndex((use: RuleSetUseItem) => use.loader.includes('ts-loader'))

        // remove ts-loader only if present
        if (tsLoaderIndex !== -1) {
          logger.debug(`\`${name}:${config.name}\` Swapping ts-loader for esbuild-loader for ${rule.test}.`)
          rule.use.splice(tsLoaderIndex, 1)
        }

        return rule
      })
    })
  },
}))
