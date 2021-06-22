import { NuxtConfig } from '@nuxt/types'
import nuxtBuildOptimisations from '../../../dist'

const config : NuxtConfig = {
  buildModules: [
    '@nuxt/typescript-build',
    nuxtBuildOptimisations
  ],
  components: true,
}

export default config
