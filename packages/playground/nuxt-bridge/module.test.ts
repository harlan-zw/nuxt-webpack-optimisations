import { describe, test, expect } from 'vitest'

const fs = require('fs')
const path = require('path')
const execa = require('execa')

describe('nuxt-bridge', () => {
  test('build works', async() => {
    // Note: this is a hacky solution
    await execa('pnpm', ['generate'], { cwd: __dirname })
    expect(fs.existsSync(path.join(__dirname, '.output', 'public', 'index.html'))).toBeTruthy()
  })
})
