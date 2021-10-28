const execa = require('execa');

describe('nuxt3-webpack',() => {

  test('renders css files without @apply', async() => {
    // Note: this is a hacky solution
    await execa('yarn', ['run', 'nuxt', 'build'], { cwd: __dirname });
  })
})
