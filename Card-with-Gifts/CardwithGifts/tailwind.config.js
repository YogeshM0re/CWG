// @ts-check
import { join } from 'path';
import forms from '@tailwindcss/forms';
import { skeleton } from '@skeletonlabs/tw-plugin';

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
  ],
  theme: {
    extend: {
      // Extend any necessary Tailwind styles
    },
  },
  plugins: [
    skeleton({
      themes: { preset: ['gold-nouveau'] },
    }),
    forms,
    // Include other necessary Tailwind plugins
  ],
};
