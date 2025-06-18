---
type: lesson
title: Welcome to Nimiq
focus: /basics.js
terminal:
  panels: ['terminal']
---

# Nimiq Web Client Tutorial

Find out how to develop decentralised applications using the Nimiq blockchain and the web client.

## What You'll Learn

Build applications that connect directly to the **Nimiq blockchain**.

## Tutorial Structure

- [Part 1: Connecting to the Network](/1-connecting-to-network/1-welcome): Network connections, consensus, and blockchain fundamentals
- [Part 2: Working with Transactions](/2-working-with-transactions/1-wallet-setup): Wallets, payments, and transaction handling  
- [Part 3: Staking and Validators](/3-staking-and-validators/1-understanding-staking): Proof-of-Stake operations and delegation

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then you can run any of the interactive examples:

- `npm run basics` - Network connection and consensus
- `npm run transactions` - Wallet and payment system  
- `npm run staking` - Delegation and rewards

Try running `npm install` in the terminal below, followed by `npm run basics` to see the network connection in action!

You can interact with the terminal directly - try running these commands:

```bash
# Install dependencies
npm install

# Run the basic network connection example
npm run basics

# Or try other examples
npm run transactions
npm run staking
```

## Prerequisites

- Basic JavaScript/Node.js knowledge
- Understanding of async/await patterns

## Additional Resources

Visit [**Nimiq Documentation**](https://nimiq.dev) for complete API reference.

### JavaScript Runtime

This tutorial runs in a **WebContainer** - a full Node.js environment that runs directly in your browser. This means:

- All code examples are written for **Node.js** 
- You get a real terminal and file system
- No local setup required

The Nimiq web client works is meant to work in any JavaScript runtime: NodeJS, browser, Deno, Bun, Cloudflare Workers... Visit [nimiq.com](https://nimiq.com) to learn more about the differences between runtime environments and how to adapt code for your specific use case. 

---

**Ready to start?** Begin with [Connecting to the Network](/tutorial/1-connecting-to-network/1-welcome)!
