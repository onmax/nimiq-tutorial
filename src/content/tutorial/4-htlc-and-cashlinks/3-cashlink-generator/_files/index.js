// Batch cashlink generator for tutorial
// This file focuses on generating a master secret, tokens, batch cashlinks, and exporting to CSV using the URL class.
// No network or transaction logic is included here.

import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { CryptoUtils } from '@nimiq/core'

// Step 1: Generate a master secret
function generateMasterSecret() {
  const randomBytes = CryptoUtils.getRandomBytes(32)
  const masterSecret = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  console.log('🔐 Master Secret:', masterSecret)
  return masterSecret
}

// Step 2: Generate a unique token for each cashlink
function generateToken(length = 8) {
  const randomBytes = CryptoUtils.getRandomBytes(6)
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, length)
}

// Step 3: Derive a cashlink secret from master secret and token
function deriveCashlinkSecret(masterSecret, token) {
  const combined = masterSecret + token
  const hash = createHash('sha256').update(combined).digest()
  return btoa(String.fromCharCode(...hash))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 32)
}

// Step 4: Build a cashlink URL using the URL class
function buildCashlinkURL(htlcAddress, secret, message = '', theme = 'nimiq') {
  const url = new URL('https://hub.nimiq.com/cashlink/#' + htlcAddress)
  if (secret) url.hash += `&s=${encodeURIComponent(secret)}`
  if (message) url.hash += `&m=${encodeURIComponent(message)}`
  if (theme) url.hash += `&t=${encodeURIComponent(theme)}`
  console.log('🌐 Cashlink URL:', url.toString())
  return url.toString()
}

// Step 5: Generate a batch of cashlinks
function generateBatchCashlinks(masterSecret, count, value, message = '', timeout = 1000) {
  const cashlinks = []
  for (let i = 0; i < count; i++) {
    const token = generateToken()
    const secret = deriveCashlinkSecret(masterSecret, token)
    // ...create hash, build HTLC, etc. (see previous lessons)
    // For this lesson, focus on the batch structure and URL
    const htlcAddress = 'NQxx ...' // Replace with actual contract address
    const url = buildCashlinkURL(htlcAddress, secret, message)
    cashlinks.push({ token, secret, htlcAddress, url, value, timeout })
  }
  return cashlinks
}

// Step 6: Export cashlinks as CSV
function exportCashlinksToCSV(cashlinks, filename = 'cashlinks.csv') {
  const header = 'token,secret,htlcAddress,url,value,timeout' // CSV header
  const rows = cashlinks.map(c => `${c.token},${c.secret},${c.htlcAddress},${c.url},${c.value},${c.timeout}`)
  const csv = [header, ...rows].join('\n')
  writeFileSync(filename, csv)
  console.log(`✅ Exported ${cashlinks.length} cashlinks to ${filename}`)
}

// Example usage:
const masterSecret = generateMasterSecret()
const batch = generateBatchCashlinks(masterSecret, 5, 100000, 'Enjoy your NIM!')
exportCashlinksToCSV(batch)
