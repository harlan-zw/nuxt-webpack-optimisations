module.exports = {
  extends: '@antfu',
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
}
