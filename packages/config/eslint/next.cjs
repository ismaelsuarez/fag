module.exports = {
  extends: [require.resolve('./base.cjs'), 'next/core-web-vitals', 'plugin:tailwindcss/recommended'],
  settings: {
    next: { rootDir: ['apps/*/'] }
  },
  rules: {}
};


