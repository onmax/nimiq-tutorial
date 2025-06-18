---
type: lesson
title: Creating and Signing Transactions
focus: /index.js
terminal:
  panels: ['output']
---

# Creating and Signing Transactions

In this lesson, we'll learn how to create, sign, and send transactions on the Nimiq network. We'll build upon the concepts from previous lessons to implement a complete transaction flow.

## What We'll Build

We're going to create a complete transaction example that:
1. Uses a pre-funded wallet (since the faucet is temporarily unavailable)
2. Reads the account balance and transaction history
3. Creates two different types of transactions
4. Signs and sends both transactions to the network

## Learning Objectives

By the end of this lesson, you'll be able to:
- Read account balances and transaction history
- Create basic transactions for simple value transfers
- Create extended transactions with custom data messages
- Sign transactions using your private key
- Send transactions to the Nimiq network
- Understand the difference between basic and extended transactions

## Understanding Transaction Types

### Basic Transactions
Basic transactions are the simplest way to transfer value:
- Transfer NIM from one address to another
- Minimal data overhead
- Most common transaction type
- Perfect for simple payments

### Extended Transactions with Data
Extended transactions can include custom data:
- Include arbitrary data (up to 64 bytes)
- Perfect for messages, metadata, or application-specific information
- Slightly larger but still efficient
- Great for adding context to payments

## Transaction Components

Every Nimiq transaction requires these components:

- **Sender**: Your wallet address (where funds come from)
- **Recipient**: Destination address (where funds go to)
- **Value**: Amount to send in Luna (Nimiq's smallest unit, 1 NIM = 100,000 Luna)
- **Fee**: Transaction fee (currently 0 in Nimiq!)
- **Valid Start Height**: Block height from which the transaction becomes valid
- **Network ID**: Identifies the network (TestAlbatross for our tutorial)
- **Data**: Optional message for extended transactions

## Current Setup Notes

**Important**: We're currently using a pre-funded private key instead of the faucet because the faucet service is temporarily unavailable. In a real application, you would:

1. Generate a fresh private key with `PrivateKey.generate()`
2. Request funds from the faucet
3. Proceed with transactions

For this tutorial, we're using a specific private key that already has funds on the test network.

## The Complete Flow

Here's what our implementation will do:

1. **Setup Connection**: Connect to the Nimiq network
2. **Create Wallet**: Use our pre-funded private key to create a wallet
3. **Check Balance**: Read the current account balance
4. **Find Transaction History**: Look at past transactions to find a recipient
5. **Create Basic Transaction**: Send half the funds using a basic transaction
6. **Create Extended Transaction**: Send the other half with a custom message
7. **Sign Both**: Use our private key to sign both transactions
8. **Send to Network**: Broadcast both transactions

## Step-by-Step Implementation

Looking at the code, you'll need to uncomment and complete each section:

### 1. Read Account Balance
```js
const account = await client.getAccount(address.toUserFriendlyAddress())
console.log('💰 Current balance:', account.balance / 1e5, 'NIM')
```

### 2. Get Transaction History
```js
const txHistory = await client.getTransactionsByAddress(address)
// Find a transaction from someone else to use as recipient
```

### 3. Create Basic Transaction
```js
const basicTx = TransactionBuilder.newBasic(
  address,           // sender
  faucetAddress,     // recipient  
  BigInt(halfAmount), // value
  0n,                // fee
  headBlock.height,   // validity start height
  networkId          // network ID
)
```

### 4. Create Extended Transaction with Data
```js
const message = "Nimiq is awesome!"
const messageBytes = new TextEncoder().encode(message)

const extendedTx = TransactionBuilder.newBasicWithData(
  address,           // sender
  faucetAddress,     // recipient
  messageBytes,      // data
  BigInt(halfAmount), // value
  0n,                // fee
  headBlock.height,   // validity start height
  networkId          // network ID
)
```

### 5. Sign and Send
```js
basicTx.sign(keyPair)
const basicTxHash = await client.sendTransaction(basicTx)

extendedTx.sign(keyPair)
const extendedTxHash = await client.sendTransaction(extendedTx)
```

## Key Concepts to Remember

- **Luna vs NIM**: Balances are returned in Luna (1 NIM = 100,000 Luna)
- **BigInt**: Transaction values must be BigInt for precise arithmetic
- **Zero Fees**: Nimiq currently has zero transaction fees
- **Signing**: Transactions must be signed with your private key before sending
- **Network ID**: Ensures transactions are only valid on the intended network

## Ready to Code?

The `index.js` file contains the complete skeleton with TODO comments. Simply uncomment each section as you work through the implementation. Each TODO represents a logical step in the transaction creation process.

💡 **Pro Tip**: The example sends funds back to the original sender (found in transaction history) to demonstrate the complete cycle, but you can send to any valid Nimiq address!
