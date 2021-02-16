// @ts-nocheck nuxt internals not typed!
import { setupTest, getNuxt } from '@nuxt/test-utils'

const cheerio = require('cheerio')

describe('Dev test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: true
    }
  })

  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="hello"]').text().trim()).toEqual('Hello World')
  })
})

describe('Production test', () => {
  console.warn = jest.fn() // eslint-disable-line no-console

  setupTest({
    testDir: __dirname,
    fixture: __dirname,
    configFile: 'nuxt.config.ts',
    build: true,
    config: {
      dev: false
    }
  })

  test('renders index route', async () => {
    const { html } = await getNuxt().server.renderRoute('/')
    const $ = cheerio.load(html)
    expect($('[data-testid="hello"]').text().trim()).toEqual('Hello World')
  })
})
