---
type: lesson
title: Creating and Signing Transactions
focus: /index.js
terminal:
  panels: ['output']
---

# Your First Blockchain Transaction!

This is the moment you've been building toward! You'll create, sign, and send your first transaction on the Nimiq blockchain. Let's turn your funded wallet into a transaction-sending powerhouse!

## What You'll Accomplish

By the end of this lesson, you'll have:

- ✅ **Sent your first blockchain transaction** - Real value moving on a global network
- ✅ **Signed with cryptographic proof** - Your private key authorizing the transfer
- ✅ **Created different transaction types** - Basic transfers and transactions with messages
- ✅ **Mastered the complete flow** - From balance checking to transaction broadcasting

## Two Types of Transactions

Nimiq supports different transaction types for different needs:

#### Basic Transactions

- **Simple value transfers** from A to B
- **Most efficient and common**
- **Perfect for payments**
- **No fees!**

#### Extended Transactions with Data

- **Include custom messages** (up to 64 bytes)
- **Great for receipts, notes, or metadata**
- **Same transfer capability** with extra context
- **No fees!**

## Transaction Essentials

Every transaction needs these key components:

- **Sender**: Your wallet address (where funds come from)
- **Recipient**: Destination address (where funds go to)
- **Value**: Amount to send in Luna (1 NIM = 100,000 Luna)
- **Fee**: Transaction fee (currently 0 in Nimiq!)
- **Valid Start Height**: Block height from which the transaction becomes valid
- **Network ID**: Identifies the network (`TestAlbatross` for our tutorial)
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

## Step 1: Check Your Current Balance

Let's see what you have to work with:

```js
// Check your current balance before sending
const account = await client.getAccount(address.toUserFriendlyAddress())
console.log('💰 Current balance:', account.balance / 1e5, 'NIM')
```

**What this does:** Queries the blockchain for your current balance. You should see the testnet NIM you received from the faucet!

## Step 2: Find a Recipient Address

We will look for the most recent address that sent funds to our wallet and return the funds to that address.

```js
// Get transaction history to find a recipient address
const txHistory = await client.getTransactionsByAddress(address)

// Find the most recent incoming transaction
const firstTx = txHistory.find(tx => tx.sender !== address.toUserFriendlyAddress())
const recipientAddress = Address.fromUserFriendlyAddress(firstTx.sender)
```

**What this does:** Gets your transaction history to find addresses that have sent you NIM (like the faucet). We'll use one of these as our recipient.

## Step 3: Create Your First Basic Transaction

Let's create a simple value transfer:

```js
const basicTx = TransactionBuilder.newBasic(
  address, // sender
  recipientAddress, // recipient
  BigInt(account.balance / 2), // value (half of balance)
  0n, // fee (0 in Nimiq!)
  headBlock.height, // validity start height
  networkId, // testnet or mainnet
)
```

**What this does:** Creates a basic transaction that sends half your balance to another address. The `BigInt` ensures precise handling of the value!

## Step 4: Sign and Send the Basic Transaction

Time to sign and send it:

```js
basicTx.sign(keyPair)
const basicTxHash = await client.sendTransaction(basicTx)
console.log('✅ Basic transaction sent! Hash:', basicTxHash.serializedTx)
```

**What this does:** Your private key signs the transaction (proving you authorize them), then broadcasts them to the global network!

## Step 5: Create an Extended Transaction with Message

Now let's create a transaction with a personal message:

```js
// Create an extended transaction with a custom message
const message = 'My first Nimiq transaction!'
const messageBytes = new TextEncoder().encode(message)

const extendedTx = TransactionBuilder.newBasicWithData(
  address, // sender
  recipientAddress, // recipient
  messageBytes, // data
  BigInt(account.balance / 2), // value (remaining half)
  0n, // fee (0 in Nimiq!)
  headBlock.height, // validity start height
  networkId, // testnet or mainnet
)
```

**What this does:** Creates a transaction with a custom message! The recipient will see your message along with the funds.

## Step 6: Sign and Send Extended Transaction

Time to authorize and broadcast:

```js
extendedTx.sign(keyPair)
const extendedTxHash = await client.sendTransaction(extendedTx)
console.log('✅ Extended transaction sent:', extendedTxHash)
```

**What this does:** Your private key signs the transaction (proving you authorize them), then broadcasts them to the global network!

## What You'll See Happen

When you run this code:

1. **Balance Check** - See your current funds
2. **Transaction Creation** - Two transactions built and ready
3. **Digital Signatures** - Your private key authorizes the transfers
4. **Network Broadcast** - Transactions sent to the blockchain
5. **Transaction Hashes** - Unique IDs for tracking your transactions

## Key Concepts Mastered

- **Zero Fees**: Nimiq's feeless transactions make micro-payments viable
- **Digital Signatures**: Your private key proves ownership and authorization
- **Transaction Hashes**: Unique identifiers for tracking transactions globally

**You joined now the millions of blockchain transactions happening worldwide!**

Your transactions will be permanently recorded on the Nimiq blockchain, verified by nodes around the globe. That's the power of decentralized networks! Don't trust, verify!
