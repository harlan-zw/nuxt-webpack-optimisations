import { defineAugmentation, deny } from '../core/util'
import { isNuxt3 } from '@nuxt/kit-edge'

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
