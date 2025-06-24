---
type: lesson
title: Understanding HTLCs
focus: /index.js
terminal:
  panels: ['output']
---

# Understanding HTLCs

In this lesson, you'll see how a Hash Time Locked Contract (HTLC) powers cashlinks in practice. You'll create and fund a real testnet cashlink, redeem it using the Nimiq Hub, and watch the blockchain for changes to the contract.

> **Warning:** This lesson uses the Nimiq Testnet. Never use real funds or mainnet for experiments!

## What is an HTLC?

An HTLC is a smart contract that locks funds until:
- The correct secret (preimage) is provided (by the redeemer)
- The claim happens before a timeout (block height)
If not claimed in time, the funds return to the sender.

Cashlinks are just HTLCs with a user-friendly URL that contains the secret and contract address.

## Step 1: Create and Fund a Testnet Cashlink 🚀

Let's create and fund a real cashlink on the Nimiq Testnet. We'll use the code below to:
- Generate a secret
- Build and send the HTLC transaction
- Display the cashlink URL

```js
import { Client, CryptoUtils, Hash, KeyPair, PrivateKey, TransactionBuilder } from '@nimiq/core'

// Connect to the Nimiq testnet
const client = new Client('wss://testnet.v2.nimiq-rpc.com')

// Generate a new wallet (for demo only; use your own for real tests)
const privateKey = PrivateKey.generate()
const keyPair = KeyPair.derive(privateKey)
const senderAddress = keyPair.toAddress().toUserFriendlyAddress()
console.log('🔑 Sender Address:', senderAddress)

// Generate a random secret
const secret = btoa(String.fromCharCode(...CryptoUtils.getRandomBytes(32)))
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '')
console.log('🔐 Secret:', secret)

// Hash the secret
const secretBytes = new TextEncoder().encode(secret)
const hashRoot = Hash.sha256(secretBytes)

// Wait for consensus
client.addConsensusChangedListener(async (state) => {
  if (state === 'established') {
    console.log('✅ Connected to Nimiq testnet!')
    // Get current block height
    const head = await client.getHeadBlock()
    const timeout = head.height + 1000 // ~1000 blocks from now
    // Build HTLC contract data
    const htlcData = {
      sender: senderAddress,
      recipient: senderAddress, // Anyone with secret can claim
      hashRoot: hashRoot.toHex(),
      hashAlgorithm: 'sha256',
      hashCount: 1,
      timeout
    }
    // Build and sign the transaction
    const tx = new TransactionBuilder()
      .sender(keyPair.toAddress())
      .recipient(keyPair.toAddress()) // Placeholder; real contract address is created by the network
      .value(100000) // 1 NIM (in Luna)
      .flag(2) // CREATE_HTLC
      .data(htlcData)
      .build()
    keyPair.signTransaction(tx)
    // Send the transaction
    const txHash = await client.sendTransaction(tx)
    console.log('🚀 Sent HTLC transaction! Hash:', txHash)
    // Display the cashlink URL
    const url = new URL('https://hub.nimiq.com/cashlink/#' + senderAddress)
    url.hash += `&s=${encodeURIComponent(secret)}`
    console.log('🌐 Cashlink URL:', url.toString())
    console.log('👉 Open this URL in https://hub.nimiq-testnet.com/ to redeem!')
  }
})
```

## Step 2: Redeem the Cashlink in Nimiq Hub 🏦

1. Copy the cashlink URL from the output above.
2. Open [Nimiq Hub Testnet](https://hub.nimiq-testnet.com/).
3. Paste the URL and follow the instructions to claim the funds.

> **Note:** You can use any Nimiq Testnet address to redeem the cashlink. The funds will be transferred to the redeemer if the secret is correct and the timeout hasn't expired.

## Step 3: Watch the Blockchain for HTLC Changes 👀

You can poll the blockchain to see if the HTLC contract has been claimed or expired. Here's a simple watcher:

```js
// Use the URL class to parse the cashlink
const cashlinkUrl = new URL('https://hub.nimiq.com/cashlink/#NQxx...&s=SECRET') // Replace with your real URL
const htlcAddress = cashlinkUrl.hash.split('&')[0].replace('#', '')

async function watchHTLC(address, client) {
  let lastState = null
  setInterval(async () => {
    const account = await client.getAccount(address)
    if (account.type === 'htlc') {
      if (lastState !== 'active') {
        console.log('🔒 HTLC is still active. Balance:', account.balance / 1e5, 'NIM')
        lastState = 'active'
      }
    } else {
      if (lastState !== 'gone') {
        console.log('🎉 HTLC claimed or expired!')
        lastState = 'gone'
      }
    }
  }, 10000) // Poll every 10 seconds
}

// Start watching (after funding the cashlink)
watchHTLC(htlcAddress, client)
```

## Summary & Next Steps

- You created and funded a real testnet cashlink (HTLC contract).
- You redeemed it using the Nimiq Hub (Testnet).
- You watched the blockchain for changes to the contract.
- **Next:** In the following lesson, you'll build a batch cashlink generator for creating and managing many cashlinks at once!

> **Tip:** Try creating and redeeming multiple cashlinks. Experiment with different secrets, timeouts, and amounts. Watch how the contract state changes on the blockchain!
