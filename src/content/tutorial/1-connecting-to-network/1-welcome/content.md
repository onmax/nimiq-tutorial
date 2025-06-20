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

✅ **Connects to the Nimiq network** - No third parties needed!  
✅ **Establishes consensus** - Syncs with the global blockchain  
✅ **Reads live blockchain data** - See real transactions and blocks  
✅ **Works in any environment** - Browser, Node.js, anywhere JavaScript runs

## What Makes Nimiq Special? 

Most blockchains require you to either:
- Download 100+ GB of data, or  
- Trust a third-party service to access the network

**Nimiq is different!** You can connect directly to the blockchain with just a few lines of JavaScript:

🚀 **Browser-Native**: Works directly in web browsers  
🔒 **No Trust Required**: Connect directly, no intermediaries  
⚡ **Zero Knowledge Proofs**: Verify everything without downloading everything  
🪶 **Lightweight**: Only downloads what you need

---

#### 🔗 Blockchain = Shared Digital Ledger
Think of it like a shared spreadsheet that everyone can read, but no one can cheat on. Every transaction is recorded and verified by the network.

#### 🤝 Consensus = Agreement
All computers in the network agree on what transactions are valid. This keeps everyone synchronized with the same "truth."

#### 🕵️ Zero Knowledge Proofs = Smart Verification
Instead of downloading everything, Nimiq uses mathematical proofs to verify blockchain data efficiently. It's like checking if someone knows a secret without them telling you the secret!

#### 🌟 Why This Matters
- **Censorship-resistant**: No one can block your transactions
- **Privacy-oriented**: No personal information required  
- **Decentralized**: Controlled by users, not corporations

## Your First Connection

Let's build a simple app that connects to the Nimiq testnet (a safe playground version of the blockchain).

#### Project Setup

Look at the `package.json` file → 

We've already configured everything you need:
- `@nimiq/core` - The complete Nimiq Web Client
- `"type": "module"` - Modern JavaScript support
- Ready-to-run scripts

#### What We'll Code

In the next step, we'll create an `index.js` file that:

1. **Imports the Nimiq client** 📦
2. **Connects to the test network** 🔌  
3. **Waits for consensus** ⏳
4. **Shows live blockchain data** 📊

You'll see real blockchain information appear in your terminal - blocks being created, transactions happening, the network staying in sync!

## Ready to Connect?

The beauty of Nimiq is its simplicity. With just a few lines of code, you'll be talking directly to a global blockchain network.

**No complex setup, no massive downloads, no third-party APIs needed.**

Let's start coding! 👨‍💻
