import { createExternalPackageIconLoader } from '@iconify/utils/lib/loader/external-pkg'
import { defineConfig } from '@tutorialkit/theme'
import { presetIcons } from 'unocss'

export default defineConfig({
  // add your UnoCSS config here: https://unocss.dev/guide/config-file
  safelist: ['i-nimiq:logos-nimiq'],
  presets: [
    presetIcons({
      collections: {
        ...createExternalPackageIconLoader('nimiq-icons'),
      },
    }),
  ],
})
