import { isNuxt3 } from '@nuxt/kit-edge'
import { defineAugmentation, deny } from '../core/util'

export default defineAugmentation(({ nuxt, nuxtOptions }) => ({

  dev: true,

  policy() {
    if (isNuxt3(nuxt))
      deny('n/a in nuxt3')
  },

  setup() {
    nuxtOptions.modern = false
  },
}))
