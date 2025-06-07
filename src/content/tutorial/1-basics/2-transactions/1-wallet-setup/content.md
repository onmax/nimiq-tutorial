---
type: lesson
title: Setting Up a Wallet
focus: /index.js
terminal:
  panels: ['output']
---

# Setting Up a Nimiq Wallet

Before we can create and send transactions, we need to set up a wallet. A wallet in Nimiq consists of a private key and its corresponding public key and address.

## Understanding Wallets in Nimiq

- A **private key** is a secret that only you should know
- The **public key** is derived from the private key and can be shared
- The **address** is derived from the public key and is what others use to send you NIM
- You need a wallet to sign transactions and prove ownership of funds

## Your Wallet Application

In this lesson, we'll create a wallet and connect it to the Nimiq testnet. We'll build upon the connection code from the previous chapter.

Looking at the `index.js` file, you can see we already have the basic connection setup. Now we need to add wallet functionality.

## Step 1: Import Wallet Classes

First, we need to import the wallet-related classes. Add these imports after the existing Nimiq import:

```js
import { Entropy } from '@nimiq/utils'
```

## Step 2: Generate a Wallet

To create a new wallet, we need to generate entropy (randomness) and create a wallet from it. Add this code after the consensus is established:

```js
// Generate a new wallet
const entropy = Entropy.generate()
const wallet = {
  keyPair: Nimiq.KeyPair.derive(entropy),
  address: Nimiq.Address.derive(entropy)
}
```

## Step 3: Display Wallet Information

Let's display the wallet information so we can see our address. Add this code after creating the wallet:

```js
console.log('🎉 Wallet created successfully!')
console.log('Address:', wallet.address.toUserFriendlyAddress())
console.log('Public Key:', wallet.keyPair.publicKey.toHex())
```

## Step 4: Check Wallet Balance

Finally, let's check the wallet balance. Add this code at the end:

```js
// Check wallet balance
const balance = await client.getBalance(wallet.address)
console.log('Balance:', Nimiq.Policy.lunasToCoins(balance), 'NIM')
```

## Understanding the Output

When you run this code, you'll see:
- A new address in user-friendly format (starting with 'NQ')
- The public key in hexadecimal format
- The current balance (which will be 0 NIM since this is a new wallet)

In the next lesson, we'll learn how to get some testnet NIM from the faucet to fund our wallet!

💡 **Note**: The address and keys will be different each time you run the application since we're generating a new wallet each time. 
