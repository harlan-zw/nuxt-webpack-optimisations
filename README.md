![](https://laravel-og.beyondco.de/Nuxt%20Build%20Optimisations.png?theme=light&packageManager=yarn&packageName=nuxt-build-optimisations&pattern=texture&style=style_1&description=Instantly+speed+up+your+Nuxt+2+build+time.&md=1&showWatermark=0&fontSize=100px&images=lightning-bolt)

<h2 align='center'><samp>nuxt-build-optimisations</samp></h2>

<p align="center">
  <a href="https://github.com/loonpwn/nuxt-build-optimisations/actions"><img src="https://github.com/loonpwn/nuxt-build-optimisations/workflows/ci/badge.svg" alt="builder"></a>
  <a href="https://npmjs.com/package/nuxt-build-optimisations"><img src="https://img.shields.io/npm/v/nuxt-build-optimisations.svg" alt="npm package"></a>
</p>

<p align='center'>Instantly speed up your Nuxt.js 2 build time.</p>


## Why and how fast?

With the introduction of [Vite](https://github.com/vitejs/vite), Nuxt feels sluggish. This package aims to give you 'vite-like' speed by modifying your
Nuxt and webpack configurations to squeeze extra performance out of the build process.

**Dev benchmark**: :snowman: **~50%** quicker cold starts, :fire: ~instant hot starts

Nuxt 3 will use Vite which will most likely make this package redundant.

## Features

**Safe**

- Development: Super quick js/ts transpiling with [esbuild](https://esbuild.github.io/) :zap:
- Development: Images only use `file-loader`
- webpack benchmarking with [speed-measure-webpack-plugin](https://github.com/stephencookdev/speed-measure-webpack-plugin)
  
**Experimental**
- Not Dev: Babel transpile for [not-dead browsers](https://github.com/browserslist/browserslist#full-list)
- Replaces [Terser](https://github.com/terser/terser) minification with [esbuild](https://esbuild.github.io/)
- Enable [Nuxt build cache](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#cache)
- webpack's [best practices for performance](https://webpack.js.org/guides/build-performance/)

**Risky**
- Enable [Nuxt parallel](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#parallel)
- Enable [Nuxt hard source](https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#hardsource)


## Setup

Install using yarn or npm. (Nuxt.js 2.10+ is required)

```bash
yarn add nuxt-build-optimisations
```

---

## Usage

Within your `nuxt.config.js` add the following.

```js
// nuxt.config.js
buildModules: [
  'nuxt-build-optimisations',
],
```

It's recommended you start with the risky profile and see if it works.

```js
buildOptimisations: {
  profile: 'risky'
}
```

A lot of the speed improvements are from heavy caching, if you have any issues the first thing you should
do is clear your cache.

```shell
rm -rf node_modules/.cache
```

# Configuration

## Profile

*Type:* `risky` | `experimental` | `safe` | `false`

*Default:* `risky`

If you have errors on the `risky` mode you should increment down in profiles until you find one that works.

Setting the profile to false will disable the optimisations, useful when you want to measure your build time without optimisations.



## Measure

*Type:* `boolean` or `object`

*Default:* `false`

When measure is enabled with true (options or environment variable), it will use the `speed-measure-webpack-plugin`.

If the measure option is an object it is assumed to be [speed-measure-webpack-plugin options](https://github.com/stephencookdev/speed-measure-webpack-plugin#options).

```js
buildOptimisations: {
  measure: {
    outputFormat: 'humanVerbose',
    granularLoaderData: true,
    loaderTopFiles: 10
  }
}
```

You can use an environment variable to enable the measure as well.

**package.json**

```json
{
  "scripts": {
    "measure": "export NUXT_MEASURE=true; nuxt dev"
  }
}
```

Note: Measure can be buggy and can only work with SSR enabled.

## Credits

- https://github.com/galvez/nuxt-esbuild-module

## License

[MIT](LICENSE)
