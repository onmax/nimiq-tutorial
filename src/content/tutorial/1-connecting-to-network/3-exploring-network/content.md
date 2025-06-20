---
type: lesson
title: Exploring Network Information
focus: /index.js
terminal:
  panels: ['output']
---

# Exploring Your Blockchain Connection! 🔍

Great! You've successfully connected to the Nimiq network and established consensus. Now let's explore what information we can get from the network.

## What You Can Access

Once consensus is established, your client has access to the current state of the blockchain. You're now connected to a global network of computers all maintaining the same digital ledger!

## Head Block Information

The **head block** is the latest block in the blockchain - think of it as the "latest news" from the network. Add this code to see current blockchain data:

```js
// Get the latest block information
const headBlock = await client.getHeadBlock()
console.log(`🏔️  Block Height: ${headBlock.height}`)
console.log(`🧱 Block Hash: ${headBlock.hash}`)
console.log(`⏰ Block Time: ${new Date(headBlock.timestamp * 1000).toLocaleString()}`)
```

**What you're seeing:**
- **Block Height**: How many blocks exist in the chain (like page numbers in a book)
- **Block Hash**: A unique fingerprint that identifies this specific block  
- **Block Time**: When this block was created and added to the blockchain

## Network Information

Let's confirm which Nimiq network you're connected to:

```js
// Check which network we're connected to
const networkId = client.getNetworkId()
console.log(`📍 Network: ${networkId}`)
```

This tells you exactly which version of Nimiq you're talking to - the testnet (for learning) or the main network.

## What This Means

With these two simple API calls, you're accessing live data from a global blockchain network:

- **Global Consensus**: The block data you see is agreed upon by nodes worldwide
- **Real-Time Updates**: This information updates as new blocks are created  
- **Decentralized Access**: You're reading directly from the blockchain, no middleman needed

## Try It Out!

Run your code and see live blockchain data appear in your terminal. You're now reading information from the same blockchain that thousands of other nodes are maintaining together.

Pretty amazing that you can access global blockchain data with just a few lines of JavaScript! 🌟
