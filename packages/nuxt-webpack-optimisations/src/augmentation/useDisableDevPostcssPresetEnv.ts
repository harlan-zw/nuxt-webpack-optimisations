import { isNuxt3 } from '@nuxt/kit-edge'
import { defineAugmentation } from '../core/util'

export default defineAugmentation(({ nuxtOptions, nuxt }) => ({

  featureKey: 'postcssNoPolyfills',
  dev: true,

  setup() {
    if (isNuxt3(nuxt)) {
      // @ts-ignore
      if (!nuxtOptions.build.postcss.postcssOptions.plugins)
        // @ts-ignore
        nuxtOptions.build.postcss.postcssOptions.plugins = {}
      // @ts-ignore
      nuxtOptions.build.postcss.postcssOptions.plugins.autoprefixer = false
    }
    else {
      // @ts-ignore
      if (!nuxtOptions.build.postcss.plugins)
        // @ts-ignore
        nuxtOptions.build.postcss.plugins = {}
      // @ts-ignore
      nuxtOptions.build.postcss.plugins['postcss-preset-env'] = false
      // @ts-ignore
      nuxtOptions.build.postcss.plugins.autoprefixer = false
    }
  },
}))
