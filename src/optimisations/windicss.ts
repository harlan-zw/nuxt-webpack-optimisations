import { OptimisationArgs } from '../types'

let tailwindConfig = {}

export default (args : OptimisationArgs) => {
  const { options, nuxtOptions, config, env } = args
  if (!config.module || !config.plugins) {
    return
  }

  if (options.profile === 'safe' || !env.isDev) {
    return
  }

  const tailwindcssIndex = nuxtOptions.buildModules.indexOf('@nuxtjs/tailwindcss')
  // must be using the official nuxtjs module
  if (tailwindcssIndex < 0) {
    return
  }

  // make sure the user has the package
  try {
    require('vue-windicss-preprocess')
  } catch (e) {
    console.warn('Please add the `vue-windi-css-preprocess` library to speed up your development build.')
    console.warn('yarn add -D vue-windi-css-preprocess')
    return
  }

  // @ts-ignore
  if (nuxtOptions.build.postcss.plugins.tailwindcss) {
    // @ts-ignore
    tailwindConfig = { ...nuxtOptions.build.postcss.plugins.tailwindcss }
    // remove the buildModule
    nuxtOptions.css = nuxtOptions.css.filter(css => !css.includes('tailwind.css'))
    // @ts-ignore
    nuxtOptions.build.postcss.preset.stage = false
    // @ts-ignore
    delete nuxtOptions.build.postcss.plugins.tailwindcss

    // @ts-ignore
    delete tailwindConfig.purge
  }
  console.log('config', tailwindConfig)

  config.module.rules.push({
    test: /\.vue$/,
    loader: 'vue-windicss-preprocess',
    options: {
      config: tailwindConfig
    }
  })
}
