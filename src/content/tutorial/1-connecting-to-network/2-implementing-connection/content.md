---
type: lesson
title: Implementing the Connection
focus: /index.js
terminal:
  panels: ['output']
---

# Your First Blockchain Connection! 🚀

Time to make the magic happen! In just a few lines of code, you'll be talking directly to the Nimiq blockchain. Let's build this step by step.

## What We're Building

Look at the `index.js` file → You'll see we've started with the basic import:

```js
import { Client, ClientConfiguration } from '@nimiq/core'
```

By the end of this lesson, this file will:
- ✅ Connect to the Nimiq testnet (a safe playground blockchain)
- ✅ Establish consensus with thousands of other nodes worldwide
- ✅ Show you live blockchain data in your terminal

**Ready to connect to your first blockchain?** Let's do this! 💪


## Step 1: Configure Your Client 🔧

First, we need to tell Nimiq how to connect. Replace the first `TODO` comment with:

```js
// Create a configuration object for network connection
const config = new ClientConfiguration()
```

**What this does:** Creates a configuration object that will hold all our connection settings. Think of it like filling out a form before joining a network.


## Step 2: Choose Your Network 🌍

Nimiq has two networks:
- **TestAlbatross**: Safe playground with test tokens for learning 🧪
- **MainAlbatross**: The production network 🖥️


For this tutorial, we'll use the testnet where you can experiment safely. Replace the second `TODO` comment with:

```js
// Connect to the test network for safe experimentation
config.network('TestAlbatross')
```

**What this does:** Tells your client "I want to connect to the test network where I can experiment safely!"

## Step 3: Set Your Connection Points 📡

The testnet needs special connection points (seed nodes). These are like the "phone numbers" your client calls to join the network. Replace the third `TODO` comment with:

```js
// Set multiple seed nodes for reliable testnet connection
config.seedNodes([
  '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
])
```

**What this does:** Gives your client multiple entry points to the testnet. If one is busy, it tries another!

> 💡 **Tip:** Mainnet doesn't need this step - it has built-in seed nodes!

## Step 4: Create Your Client 🎯

Now let's turn our configuration into a working client! Replace the fourth `TODO` comment with:

```js
// Create the client with our configuration
const client = await Client.create(config.build())
```

**What this does:** This is where the magic starts! Your client is born and ready to connect to the blockchain network.

## Step 5: Establish Consensus 🤝

The final step - join the global network and sync with everyone else! Replace the fifth `TODO` comment with:

```js
// Wait for consensus with the network
await client.waitForConsensusEstablished()
console.log('✅ Consensus established!')
```

**What this does:** Your client talks to other nodes, agrees on the current state of the blockchain, and becomes a fully participating member of the network!

## Pro Configuration Tips

Want to make your connection even better? Add these optional configurations after Step 1:

```js
// Super fast sync mode
config.syncMode('pico')

// Reduce log spam in terminal  
config.logLevel('error')
```

**Pico mode:** Downloads only essential data instead of everything. Perfect for apps that don't need the full blockchain history!

## What Happens When You Run This?

When you execute this code, you'll see:

1. **Connection messages** - Your client reaching out to seed nodes
2. **Sync progress** - Downloading and verifying blockchain data  
3. **Consensus established** - Success! You're connected!
4. **Your celebration message** - "🎉 Connected to Nimiq testnet!"

## The Magic You Just Performed

Congratulations! You just:

- Connected directly to a **global blockchain network**
- Joined thousands of other nodes around the world
- Established **cryptographic consensus** without trusting anyone
- Did it all with **pure JavaScript** in seconds, not hours

This is what makes Nimiq special - blockchain connections that are fast, simple, and work anywhere JavaScript runs!

## Ready to Test?

Run your code and watch as your application joins the global Nimiq network. You're about to see your first real blockchain connection! 🌟
