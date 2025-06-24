---
type: lesson
title: Building a Cashlink Generator
focus: /index.js
terminal:
  panels: ['output']
---

# Building a Cashlink Generator 🏗️

In this lesson, you'll build a batch cashlink generator that can create, fund, and export multiple cashlinks efficiently. You'll use a master secret and token system for secure, scalable generation, and export your cashlinks as CSV for easy sharing or tracking.

> **Prerequisite:**
> You should know how to connect to the Nimiq network, set up a wallet, and create a single cashlink from previous lessons.

---

## What You'll Build

- ✅ **Master secret system** – Generate multiple cashlinks from one secret
- ✅ **Token system** – Unique tokens for each cashlink
- ✅ **Batch creation** – Create many cashlinks at once
- ✅ **CSV export** – Export cashlinks for sharing or backup

---

## Step 1: Generate a Master Secret 🔑

A master secret lets you deterministically generate many cashlinks. Each cashlink will use a unique token combined with the master secret.

```js
function generateMasterSecret() {
  const randomBytes = CryptoUtils.getRandomBytes(32)
  const masterSecret = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  console.log('🔐 Master Secret:', masterSecret)
  return masterSecret
}
```

---

## Step 2: Generate Tokens 🏷️

Each cashlink gets a unique token:

```js
function generateToken(length = 8) {
  const randomBytes = CryptoUtils.getRandomBytes(6)
  return btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, length)
}
```

---

## Step 3: Derive Cashlink Secrets and Hashes 🔒

Combine the master secret and token to create a unique secret and hash for each cashlink:

```js
function deriveCashlinkSecret(masterSecret, token) {
  const combined = masterSecret + token
  const hash = createHash('sha256').update(combined).digest()
  return btoa(String.fromCharCode(...hash))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .substring(0, 32)
}
```

---

## Step 4: Build Cashlink URLs with the URL Class 🌐

Use the `URL` class to build cashlink URLs safely and clearly:

```js
function buildCashlinkURL(htlcAddress, secret, message = '', theme = 'nimiq') {
  const url = new URL('https://hub.nimiq.com/cashlink/#' + htlcAddress)
  if (secret) url.hash += `&s=${encodeURIComponent(secret)}`
  if (message) url.hash += `&m=${encodeURIComponent(message)}`
  if (theme) url.hash += `&t=${encodeURIComponent(theme)}`
  console.log('🌐 Cashlink URL:', url.toString())
  return url.toString()
}
```

---

## Step 5: Batch Cashlink Generation 🚀

Here's how to generate a batch of cashlinks:

```js
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
```

---

## Step 6: Export Cashlinks as CSV 📋

Export your batch of cashlinks for sharing or backup:

```js
function exportCashlinksToCSV(cashlinks, filename = 'cashlinks.csv') {
  const header = 'token,secret,htlcAddress,url,value,timeout' // CSV header
  const rows = cashlinks.map(c => `${c.token},${c.secret},${c.htlcAddress},${c.url},${c.value},${c.timeout}`)
  const csv = [header, ...rows].join('\n')
  require('fs').writeFileSync(filename, csv)
  console.log(`✅ Exported ${cashlinks.length} cashlinks to ${filename}`)
}
```

---

## Summary & Next Steps

- You built a batch cashlink generator using a master secret and token system.
- You used the URL class for safe, clear cashlink URLs.
- You exported your cashlinks as CSV for easy sharing or backup.
- **Next:** Try funding and redeeming your cashlinks on the Nimiq Testnet using the Hub!

> **Tip:** Experiment with different batch sizes, messages, and timeouts. Try importing your CSV into a spreadsheet to track your cashlinks.
