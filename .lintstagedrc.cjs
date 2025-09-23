module.exports = {
  '**/*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    () => 'pnpm -w typecheck'
  ],
  '**/*.{json,md,css,scss}': ['prettier -w']
};


