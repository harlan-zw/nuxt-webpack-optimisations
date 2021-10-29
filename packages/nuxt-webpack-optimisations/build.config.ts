import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    'src/module',
  ],
  externals: [
    '@nuxt/kit',
    '@nuxt/kit-edge',
    'esbuild-loader',
    'consola',
    'pathe',
    'defu',
  ],
})
