import { defineAugmentation, deny } from '../core/util'

export default defineAugmentation(({ options, nuxtOptions }) => ({

  featureKey: 'cacheLoader',

  policy() {
    if (options.measure)
      return deny('optimisations disabled while `measure` is enabled')
  },

  setup() {
    nuxtOptions.build.cache = true
  },
}))
