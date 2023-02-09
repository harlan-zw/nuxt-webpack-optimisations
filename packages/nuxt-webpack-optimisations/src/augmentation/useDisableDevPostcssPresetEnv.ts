import { getNuxtVersion } from '@nuxt/kit'
import { defineAugmentation, deny } from '../core/util'

export default defineAugmentation(({ nuxtOptions, nuxt }) => ({

  featureKey: 'postcssNoPolyfills',
  dev: true,

  policy() {
    // @ts-expect-error nuxt mistyped
    if (nuxtOptions.build.postcss === false)
      return deny('postcss is disabled')
  },

  setup() {
    const version = getNuxtVersion(nuxt)
    if (version.startsWith('2.6.') || version.startsWith('3.')) {
      if (!nuxtOptions.build.postcss.postcssOptions.plugins)
        nuxtOptions.build.postcss.postcssOptions.plugins = {}
      nuxtOptions.build.postcss.postcssOptions.plugins.autoprefixer = false
    }
    else {
      // @ts-expect-error nuxt mistyped
      if (!nuxtOptions.build.postcss.plugins)
        // @ts-expect-error nuxt mistyped
        nuxtOptions.build.postcss.plugins = {}
      // @ts-expect-error nuxt mistyped
      nuxtOptions.build.postcss.plugins['postcss-preset-env'] = false
      // @ts-expect-error nuxt mistyped
      nuxtOptions.build.postcss.plugins.autoprefixer = false
    }
  },
}))
