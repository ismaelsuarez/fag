import type { Config } from 'tailwindcss';
import preset from '../../packages/ui/tailwind/preset.js';

export default {
  darkMode: ['class'],
  presets: [preset as unknown as Config],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/ui/tailwind/**/*.{js,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;


