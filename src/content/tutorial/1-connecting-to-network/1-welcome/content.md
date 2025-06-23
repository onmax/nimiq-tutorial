---
type: lesson
title: Understanding Nimiq and Blockchain Basics
focus: /package.json
terminal:
  panels: ['output']
---

# Connecting to the Nimiq Network! 🌐

Welcome to your first hands-on lesson! In this part, you'll connect directly to the Nimiq blockchain and see it in action.

## What You'll Build

By the end of this section, you'll have a working application that:

- **Connects to the Nimiq network** - No third parties needed!
- **Establishes consensus** - Syncs with the global blockchain
- **Reads live blockchain data** - See real transactions and blocks
- **Works in any environment** - Browser, Node.js, anywhere JavaScript runs

## Quick Preview

Here's what your code will look like:

```javascript
// 1. Import the Nimiq Client
import { Client, ClientConfiguration } from '@nimiq/core'

// 2. Configure the client for the testnet
const config = new ClientConfiguration()
config.network('TestAlbatross')
// ... more configuration for seed nodes and sync mode ...

// 3. Create the client and connect
const client = await Client.create(config.build())

// 4. Wait for consensus to be established
await client.waitForConsensusEstablished()
console.log('✅ Consensus established!')

// 5. Interact with the blockchain
const headBlock = await client.getHeadBlock()
console.log(`📊 Current block height: ${headBlock.height}`)
```

Simple, right? Let's build it step by step.

## Project Setup

We'll build a simple app that connects to the Nimiq testnet (a safe playground version of the blockchain).

Look at the `package.json` file. We've already configured everything you need:

- `@nimiq/core` - The complete Nimiq Web Client
- `"type": "module"` - Modern JavaScript support
- Ready-to-run scripts

Check the console — we have already run the commands `npm install` and `npm run dev` automatically. Just update the code and the script will run again with your changes.

Now, update the code to print `'Hello Nimiq!'` in the console.

> Tip: You can also click the 'Solve' button in the top right corner to view the solution.

## What We'll Code Next

In the next step, we'll create an `index.js` file that:

1. **Imports the Nimiq client**
2. **Connects to the test network**
3. **Waits for consensus**
4. **Shows live blockchain data**

You'll see real blockchain information appear in your terminal - blocks being created, transactions happening, the network staying in sync!

The beauty of Nimiq is its simplicity. With just a few lines of code, you'll be talking directly to a global blockchain network.

**No complex setup, no massive downloads, no third-party APIs needed.**

Let's start coding!
