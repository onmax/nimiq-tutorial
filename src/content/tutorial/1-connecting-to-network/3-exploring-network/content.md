---
type: lesson
title: Exploring Network Information
focus: /index.js
terminal:
  panels: ['output']
---

# Exploring Your Blockchain Connection!

Great! You've successfully connected to the Nimiq network and established consensus. Now let's explore what information we can get from the network.

## What You Can Access

Once consensus is established, your client has access to the current state of the blockchain. You're now connected to a global network of computers all maintaining the same digital ledger!

## Network Information

Let's confirm which Nimiq network you're connected to:

```js
const networkId = await client.getNetworkId()
let networkName = 'unkwown'
if (networkId === 5)
  networkName = 'testnet'
else if (networkId === 6)
  networkName = 'mainnet'
console.log(`🌐 Connected to ${networkName} network`)
```

This tells you exactly which version of Nimiq you're talking to - the testnet (for learning) or the main network.

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

### Listening for New Blocks

Instead of asking for the latest block repeatedly, you can subscribe to get notified every time a new block is added to the chain. It's like getting a push notification for blockchain updates!

```js
// Subscribe to new head blocks
await client.addHeadChangedListener((hash) => {
  console.log(`🎉 New block mined! Hash: ${hash}`)
})
```

Now, your application will react in real-time as the blockchain grows. This is incredibly powerful for building dynamic and responsive dapps.

### Getting Full Block Details on Subscription

But what if you need more than just the hash? You can combine what you've learned to get the full block data in real-time.

Inside your listener, you can use the `getBlock()` method with the new `hash` to fetch the complete block details:

```js
// Subscribe to new head blocks and get the full block
const listenerId = await client.addHeadChangedListener(async (hash) => {
  const block = await client.getBlock(hash)
  console.log(`🎉 New block. Block number: ${block.height}. Hash: ${hash}`)
})

console.log('👂 Subscribed to head changes and now getting full blocks!')
```

## What This Means

With these simple API calls, you're accessing live data from a global blockchain network:

- **Global Consensus**: The block data you see is agreed upon by nodes worldwide
- **Real-Time Updates**: This information updates as new blocks are created
- **Decentralized Access**: You're reading directly from the blockchain, no middleman needed
