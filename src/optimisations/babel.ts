import { NuxtWebpackEnv } from '@nuxt/types/config/build'

export default (nuxt: any) => {
  nuxt.options.build.babel.presets = ({ isServer }: NuxtWebpackEnv) => {
    return [
      [
        '@nuxt/babel-preset-app',
        {
          // nuxt.js defaults
          modules: false,
          useBuiltIns: 'usage',
          corejs: {
            version: 3,
            proposals: true
          },
          // use only latest chrome for development
          ignoreBrowserslistConfig: true,
          targets: !isServer
            ? '> 0.5%, last 2 versions, Firefox ESR, not dead'
            : { node: true },
          // decreases overall package size. See: https://babeljs.io/docs/en/babel-preset-env#bugfixes
          bugfixes: true
        }
      ]
    ]
  }
}
