---
type: lesson
title: Creating a Cashlink
focus: /index.js
terminal:
  panels: ['output']
---

# Creating a Cashlink

In this lesson, you'll learn how to create a Nimiq cashlink—a shareable payment link powered by a Hash Time Locked Contract (HTLC). We'll focus on the mechanics of generating a secret, building the contract, and producing a cashlink URL.

> **Prerequisite:**
> You should already know [how to connect to the Nimiq network](/1-connecting-to-network/1-welcome) and [set up a wallet](/2-working-with-transactions/1-wallet-setup) from previous chapters.

---

## What You'll Build

- ✅ **Secret generator** – Secure random secrets for cashlinks
- ✅ **HTLC transaction builder** – Smart contracts that hold the funds
- ✅ **Cashlink URL creator** – Shareable links with embedded secrets

---

## Step 1: Generate a Cashlink Secret 🔑

A cashlink uses a random secret to secure the funds. Let's create a function to generate a strong, URL-safe secret:

```js
// These imports are node specific.
// You need to adapt it to your runtime.
import { randomBytes } from 'node:crypto'
import { Buffer } from 'node:buffer'

/**
 * Returns 32 random bytes formatted as base 64
 */
function generateCashlinkSecret() {
  const bytes = new Uint8Array(randomBytes(32))
  const secret = Buffer.from(bytes).toString('base64')
  console.log('Generated Secret:', secret)
  return secret
}
```

---

## Step 2: Create a Hash from the Secret

The HTLC contract stores a hash of the secret. Only someone who knows the secret can claim the funds.

```js
// This imports are node specific.
// You need to adapt it to your runtime.
import { createHash } from 'node:crypto'

/**
 * Creates a hash from the secret
 */
function createHashFromSecret(secret) {
  const input = Buffer.from(secret)
  const hash = createHash('sha256')
    .update(input)
    .digest('hex')
  return hash
}
```

---

## Step 3: Build the Cashlink URL

A cashlink is a URL that contains the contract address and the secret. Here's a helper to build it:

```js
function buildCashlinkURL(htlcAddress, secret, message = '', network = 'TestAlbatross') {
  const hubDomain = network === 'MainAlbatross' ? 'https://hub.nimiq.com/cashlink/#' : 'https://hub.nimiq-testnet.com/cashlink/#'
  const url = new URL(humDomain + htlcAddress);

  if (secret) url.searchParams.append('s', secret);
  if (message) url.searchParams.append('m', message);

  console.log('Cashlink URL:', url.toString());
  return url.toString();
}
```

---

## Step 4: Putting It All Together

Here's how you might use these helpers to create a cashlink (assuming you already have a connected client and a funded wallet):

```js
// 1. Generate a secret
const secret = generateCashlinkSecret()

// 2. Create a hash from the secret
const hashRoot = createHashFromSecret(secret)

// 3. (In a real app, build and send the HTLC transaction here)
//    For this lesson, focus on the cashlink structure, not sending the transaction.

// 4. Build the cashlink URL
const htlcAddress = 'NQxx ...' // Replace with your contract address after creating the HTLC
const url = buildCashlinkURL(htlcAddress, secret, 'Enjoy your NIM!')
```

---

## Summary & Next Steps

- You learned how to generate a cashlink secret, hash it, and build a cashlink URL.
- In a real application, you'd use these helpers after creating an HTLC contract on-chain.
- **Next:** In the following lesson, you'll dive deeper into how HTLCs work and how to inspect them on the blockchain.

> **Tip:** Try changing the secret or message and see how the URL changes. Experiment with different values to understand the structure!
