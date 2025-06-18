---
type: lesson
title: Exploring Network Information
focus: /index.js
terminal:
  panels: ['output']
---

# Exploring Network Information

Great! You've successfully connected to the Nimiq network and established consensus. Now let's explore what information we can get from the network.

## Getting Network Information

Once consensus is established, your client has access to the current state of the blockchain. Let's add some code to explore the network information.

## Head Block Information

The head block is the latest block in the blockchain. You can get information about it:

```js
const headBlock = await client.getHeadBlock()
console.log(`📊 Current block height: ${headBlock.height}`)
console.log(`🧱 Head block hash: ${headBlock.hash}`)
console.log(`⏰ Head block timestamp: ${new Date(headBlock.timestamp * 1000)}`)
```

## Network Information

You can also get information about which network you're connected to:

```js
const networkId = client.getNetworkId()
console.log(`🌐 Connected to network: ${networkId}`)
```
