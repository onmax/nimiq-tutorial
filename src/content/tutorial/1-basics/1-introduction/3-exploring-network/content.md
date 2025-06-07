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

## Current Block Height

The block height represents the number of blocks in the blockchain. You can get the current block height using:

```js
const blockHeight = client.blockHeight
console.log(`📊 Current block height: ${blockHeight}`)
```

## Network Information

You can also get information about which network you're connected to:

```js
const networkId = client.networkId
console.log(`🌐 Connected to network: ${networkId}`)
```

## Head Block Information

The head block is the latest block in the blockchain. You can get information about it:

```js
const headBlock = await client.getHeadBlock()
console.log(`🧱 Head block hash: ${headBlock.hash}`)
console.log(`⏰ Head block timestamp: ${new Date(headBlock.timestamp * 1000)}`)
```

## Your Task

Add the code above to your `index.js` file after the consensus is established. This will give you insight into the current state of the Nimiq network.

The final structure should look like this:

1. Import Nimiq
2. Create configuration and client
3. Wait for consensus
4. Log network information
5. Get and display block information

## 🔄 Live Development

With **auto-reload enabled**, your changes will automatically restart the application. Watch the terminal to see the application restart and display the new network information!

Try running the application to see the current state of the Nimiq testnet! 
