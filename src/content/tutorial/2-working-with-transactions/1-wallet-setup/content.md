---
type: lesson
title: Setting Up a Wallet
focus: /index.js
terminal:
  panels: ['output']
---

# Setting Up a Nimiq Wallet 🔐

Before we can create and send transactions, we need to set up a wallet. A wallet in Nimiq consists of a private key and its corresponding public key and address.

## Understanding Wallets in Nimiq

- A **private key** 🔑 is a secret that only you should know
- The **public key** is derived from the private key and can be shared
- The **address** 📍 is derived from the public key and is what others use to send you NIM
- You need a wallet to sign transactions and prove ownership of funds

## Your Wallet Application

In this lesson, we'll create a wallet and connect it to the Nimiq testnet. We'll build upon the connection code from the previous chapter.

Looking at the `index.js` file, you can see we already have the basic connection setup and imports ready. Now we need to add wallet functionality.

## Step 1: Generate a Private Key

First, we need to generate a new private key. This is the foundation of our wallet:

```js
const privateKey = PrivateKey.generate()
```

## Step 2: Create a KeyPair

From the private key, we can derive a KeyPair that contains both the private and public keys:

```js
const keyPair = KeyPair.derive(privateKey)
```

## Step 3: Get the Address

The address is derived from the KeyPair and is what others will use to send you NIM:

```js
const address = keyPair.toAddress()
```

## Step 4: Display Wallet Information

Let's display the wallet information so we can see our address and public key:

```js
console.log('📍 Address:', address.toUserFriendlyAddress())
console.log('🔐 Public Key:', keyPair.publicKey.toHex())
```

## Step 5: Check Wallet Balance

Finally, let's check the wallet balance using the client:

```js
const account = await client.getAccount(address.toUserFriendlyAddress())
console.log('📊 Account:', account)

// Convert lunas to NIM (1 NIM = 100,000 lunas)
const nim = account.balance / 1e5
console.log(`💰 Balance: ${nim} NIM`)
```

## Understanding the Output

When you run this code, you'll see:
- A new address in user-friendly format (starting with 'NQ')
- The public key in hexadecimal format
- The current balance (which will be 0 NIM since this is a new wallet)
- The complete account information from the blockchain

## Key Concepts

- **Luna to NIM conversion**: Nimiq uses "lunas" as the smallest unit (like satoshis in Bitcoin). 1 NIM = 100,000 lunas
- **User-friendly addresses**: These start with 'NQ' and are easier to read and share

## Important: Private Key Storage 🔒

In this tutorial, we're generating a new private key each time we run the application. This means you'll get a different wallet address and lose access to any previous funds when you restart the program.

**In a real application, you need to store and retrieve your private key securely!** We'll cover proper private key storage and wallet recovery in a future chapter, including:

- Saving private keys to secure storage
- Loading existing wallets from stored keys
- Best practices for key security
- Backup and recovery strategies

For now, just remember that each run creates a completely new wallet.

## Next Steps

In the next lesson, we'll learn how to get some testnet NIM from the faucet to fund our wallet! 🚰

> 💡 **Note**: The address and keys will be different each time you run the application since we're generating a new wallet each time.
