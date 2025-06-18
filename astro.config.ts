import tutorialkit from '@tutorialkit/astro';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://tutorial.nimiq.com',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    tutorialkit({
      components: {
        TopBar: './src/components/CustomTopBar.astro',
      },
      config: {
        ogImage: '/og-image.jpg',
      },
    }),
  ],
});
