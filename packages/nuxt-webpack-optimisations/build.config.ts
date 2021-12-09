import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    'src/module',
  ],
  externals: [
    '@nuxt/schema',
  ],
})
