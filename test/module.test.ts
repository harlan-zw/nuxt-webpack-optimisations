// @ts-nocheck nuxt internals not typed!
import { setupTest, getNuxt } from '@nuxt/test-utils'

const cheerio = require('cheerio')

describe('Default Dev test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: 'fixtures/basic',
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: true
    }
  })

  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="title"]').text().trim()).toEqual('Hello World')
    expect($('[data-testid="smallImg"]').attr('src')).toEqual('/_nuxt/test/fixtures/basic/image/small.svg')
    expect($('[data-testid="bigImg"]').attr('src')).toEqual('/_nuxt/test/fixtures/basic/image/big.jpg')
  })

  test('nuxt options are updated', async () => {
    const options = await getNuxt().options
    expect(options.build.cache).toBeTruthy()
    expect(options.build.hardSource).toBeFalsy()
    expect(options.build.parallel).toBeFalsy()
    expect(options.build.transpile).toStrictEqual([])

    expect(options.features.layouts).toBeFalsy()
    expect(options.features.store).toBeFalsy()
    expect(options.features.middleware).toBeFalsy()
  })
})

describe('Default Production test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: 'fixtures/basic',
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: false
    }
  })

  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="title"]').text().trim()).toEqual('Hello World')
    expect($('[data-testid="smallImg"]').attr('src')).toContain('data:image/svg+xml;base64,')
    expect($('[data-testid="bigImg"]').attr('src')).toContain('/_nuxt/img/big')
  })
})

describe('Vuetify test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: 'fixtures/vuetify',
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: true
    }
  })

  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="button"]').text().trim()).toEqual('Hello World')
  })
})
