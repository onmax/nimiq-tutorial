import vue from '@astrojs/vue'
import tutorialkit from '@tutorialkit/astro'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://tutorial.nimiq.com',
  devToolbar: {
    enabled: false,
  },
  vite: {
    define: {
      __FEEDBACK_DOMAIN__: JSON.stringify('https://nimiq-feedback.je-cf9.workers.dev'),
    },
  },
  integrations: [
    tutorialkit({
      components: {
        TopBar: './src/components/CustomTopBar.astro',
      },
    }),
    vue(),
  ],
})
