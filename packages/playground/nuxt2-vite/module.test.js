const fs = require('fs')
const path = require('path')
const execa = require('execa')

describe('nuxt2-vite', () => {
  test('build works', async() => {
    // Note: this is a hacky solution
    await execa('yarn', ['run', 'nuxt', 'generate'], { cwd: __dirname })
    expect(fs.existsSync(path.join(__dirname, 'dist', 'index.html'))).toBeTruthy()
  })
})
