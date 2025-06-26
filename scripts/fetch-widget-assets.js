// ESM version: Fetch Nimiq Feedback Widget assets using fetch and pathe
// Usage: node scripts/fetch-widget-assets.js

import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'pathe'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const files = [
  {
    url: 'https://nimiq-feedback.je-cf9.workers.dev/widget.css',
    dest: join(__dirname, '../public/widget.css'),
  },
  {
    url: 'https://nimiq-feedback.je-cf9.workers.dev/widget.js',
    dest: join(__dirname, '../public/widget.js'),
  },
]

for (const { url, dest } of files) {
  try {
    const res = await fetch(url)
    if (!res.ok)
      throw new Error(`Failed to fetch ${url}: ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    await fs.writeFile(dest, buf)
    console.log(`✅ Downloaded ${url} → ${dest}`)
  }
  catch (err) {
    console.error(`❌ Failed to download ${url}:`, err.message)
  }
}
