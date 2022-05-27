import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  rollup: {
    esbuild: {
      target: 'es2019',
    },
  },
})
