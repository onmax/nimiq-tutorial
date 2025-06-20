---
type: lesson
title: Creating and Signing Transactions
focus: /index.js
terminal:
  panels: ['output']
---

# Your First Blockchain Transaction! 💸

This is the moment you've been building toward! You'll create, sign, and send your first transaction on the Nimiq blockchain. Let's turn your funded wallet into a transaction-sending powerhouse!

## What You'll Accomplish

By the end of this lesson, you'll have:

✅ **Sent your first blockchain transaction** - Real value moving on a global network  
✅ **Signed with cryptographic proof** - Your private key authorizing the transfer  
✅ **Created different transaction types** - Basic transfers and transactions with messages  
✅ **Mastered the complete flow** - From balance checking to transaction broadcasting

## Two Types of Transactions 📋

Nimiq supports different transaction types for different needs:

#### Basic Transactions 💰
- **Simple value transfers** from A to B
- **Most efficient and common**
- **Perfect for payments**

#### Extended Transactions with Data 📝
- **Include custom messages** (up to 64 bytes)
- **Great for receipts, notes, or metadata**
- **Same transfer capability** with extra context

## Transaction Essentials

Every transaction needs these key components:

- **Sender**: Your wallet address (where funds come from)
- **Recipient**: Destination address (where funds go to)
- **Value**: Amount to send in Luna (1 NIM = 100,000 Luna)
- **Fee**: Transaction fee (currently 0 in Nimiq!)
- **Valid Start Height**: Block height from which the transaction becomes valid
- **Network ID**: Identifies the network (TestAlbatross for our tutorial)
- **Data**: Optional message for extended transactions (up to 64 bytes)

## Setup Note

**Important**: For this tutorial, we're using a pre-funded private key since the faucet service is temporarily unavailable. In a real application, you would:

1. Generate a fresh private key with `PrivateKey.generate()`
2. Request funds from the faucet (or receive them from someone else)
3. Proceed with transactions

This approach ensures you can complete the tutorial even if the faucet is down, while learning the same transaction concepts.

## Your Transaction Journey

Here's what we'll build together:

1. **Check Your Balance** - See how much you have to work with
2. **Find a Recipient** - Use transaction history to find an address
3. **Create Two Transactions** - One basic, one with a message
4. **Sign Both** - Authorize with your private key
5. **Send to Network** - Broadcast to the blockchain!

## Step 1: Check Your Current Balance 💰

Let's see what you have to work with:

```js
// Check your current balance before sending
const account = await client.getAccount(address.toUserFriendlyAddress())
console.log('💰 Current balance:', account.balance / 1e5, 'NIM')
```

**What this does:** Queries the blockchain for your current balance. You should see the testnet NIM you received from the faucet!

## Step 2: Find a Recipient Address 🔍

We'll look at your transaction history to find someone to send funds to:

```js
// Get transaction history to find a recipient address
const txHistory = await client.getTransactionsByAddress(address)
// Find a transaction from someone else to use as recipient
```

**What this does:** Gets your transaction history to find addresses that have interacted with you (like the faucet). We'll use one of these as our recipient.

## Step 3: Create Your First Basic Transaction 📤

Let's create a simple value transfer:

```js
// Create a basic transaction to send funds
const basicTx = TransactionBuilder.newBasic(
  address,              // sender (you!)
  faucetAddress,        // recipient  
  BigInt(halfAmount),   // value to send
  0n,                   // fee (free!)
  headBlock.height,     // when it becomes valid
  networkId             // testnet ID
)
```

**What this does:** Creates a basic transaction that sends half your balance to another address. The `BigInt` ensures precise handling of the value!

## Step 4: Create an Extended Transaction with Message 💬

Now let's add a personal message:

```js
// Create an extended transaction with a custom message
const message = "My first Nimiq transaction!"
const messageBytes = new TextEncoder().encode(message)

const extendedTx = TransactionBuilder.newBasicWithData(
  address,              // sender (you!)
  faucetAddress,        // recipient
  messageBytes,         // your message
  BigInt(halfAmount),   // remaining balance
  0n,                   // fee (still free!)
  headBlock.height,     // validity start
  networkId             // testnet ID
)
```

**What this does:** Creates a transaction with a custom message! The recipient will see your message along with the funds.

## Step 5: Sign and Send Both Transactions 🔐

Time to authorize and broadcast:

```js
// Sign the basic transaction
basicTx.sign(keyPair)
const basicTxHash = await client.sendTransaction(basicTx)
console.log('✅ Basic transaction sent:', basicTxHash)

// Sign the extended transaction
extendedTx.sign(keyPair)
const extendedTxHash = await client.sendTransaction(extendedTx)
console.log('✅ Extended transaction sent:', extendedTxHash)
```

**What this does:** Your private key signs both transactions (proving you authorize them), then broadcasts them to the global network!

## What You'll See Happen

When you run this code:

1. **Balance Check** - See your current funds
2. **Transaction Creation** - Two transactions built and ready
3. **Digital Signatures** - Your private key authorizes the transfers
4. **Network Broadcast** - Transactions sent to the blockchain
5. **Transaction Hashes** - Unique IDs for tracking your transactions

## Key Concepts Mastered 🧠

- **Luna vs NIM**: Blockchain uses Luna (smallest unit), display shows NIM
- **BigInt Precision**: Ensures exact value handling for financial operations
- **Zero Fees**: Nimiq's feeless transactions make micro-payments viable
- **Digital Signatures**: Your private key proves ownership and authorization
- **Transaction Hashes**: Unique identifiers for tracking transactions globally

## Ready to Send Your First Transaction?

The `index.js` file has the complete skeleton with TODO comments. Uncomment each section as you implement it. Each step builds on the previous one, creating a complete transaction flow.

**You're about to join the millions of blockchain transactions happening worldwide!** 

Your transactions will be permanently recorded on the Nimiq blockchain, verified by nodes around the globe. That's the power of decentralized networks! 🌟
