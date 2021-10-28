import { defineAugmentation, deny } from '../core/util'

export default defineAugmentation(({ options, nuxtOptions }) => ({

  dev: true,
  featureKey: 'hardSourcePlugin',

  policy() {
    if (options.measure)
      return deny('optimisations disabled while `measure` is enabled')
  },

  setup() {
    nuxtOptions.build.hardSource = true
  },
}))
