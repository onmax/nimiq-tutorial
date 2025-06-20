---
type: lesson
title: Setting Up a Wallet
focus: /index.js
terminal:
  panels: ['output']
---

# Creating Your First Nimiq Wallet! 🔐

Time to create your blockchain identity! A wallet is your gateway to the Nimiq network - it lets you send, receive, and manage your digital assets.

## What Makes a Nimiq Wallet

Think of a wallet like a digital keychain:

- **Private key**: Your secret that controls your funds (never share this!)
- **Public key**: Derived from your private key, safe to share
- **Address**: Your "account number" that others use to send you NIM
- **Signing power**: Ability to authorize transactions and prove ownership

## Your First Wallet

We'll create a brand new wallet and connect it to the testnet. Look at the `index.js` file - we're building on the connection code from the previous chapter.

Let's create your blockchain identity step by step!

## Step 1: Generate Your Private Key 🔑

This creates the foundation of your wallet - your unique secret key:

```js
// Generate a secure random private key
const privateKey = PrivateKey.generate()
```

**What this does:** Generates a cryptographically secure random private key. This is like creating a master password for your blockchain identity!

## Step 2: Create Your KeyPair 🗝️

Transform your private key into a working keypair:

```js
// Derive public key from private key
const keyPair = KeyPair.derive(privateKey)
```

**What this does:** Derives your public key from the private key using elliptic curve cryptography. Now you have both keys needed for blockchain operations!

## Step 3: Get Your Address 📍

Create your public blockchain address:

```js
// Create your public blockchain address
const address = keyPair.toAddress()
```

**What this does:** Generates your Nimiq address from your public key. This is what people will use to send you NIM - like your blockchain "email address"!

## Step 4: Display Your Wallet Identity 🎉

Let's see your new blockchain identity:

```js
// Display your wallet information
console.log('🎉 Your new Nimiq wallet:')
console.log('📍 Address:', address.toUserFriendlyAddress())
console.log('🔐 Public Key:', keyPair.publicKey.toHex())
```

**What you'll see:** Your unique Nimiq address (starting with 'NQ') and your public key in hexadecimal format.

## Step 5: Check Your Balance 💰

Let's check if your wallet has any funds:

```js
// Check your wallet balance
const account = await client.getAccount(address.toUserFriendlyAddress())
console.log('📊 Account:', account)

// Convert lunas to NIM (1 NIM = 100,000 lunas)
const nim = account.balance / 1e5
console.log(`💰 Balance: ${nim} NIM`)
```

**What this does:** Queries the blockchain for your account information. Since this is a brand new wallet, you'll see 0 NIM - but that's about to change! 

## Understanding Your Output

When you run this code, you'll see:

- **Your address**: Starts with 'NQ' - this is your blockchain identity!
- **Your public key**: The cryptographic key others can use to verify your transactions
- **Your balance**: Currently 0 NIM (we'll fix this in the next lesson!)
- **Account details**: Complete information about your account on the blockchain

## Important: Your Wallet's Lifecycle

Each time you run this code, you create a **completely new wallet** with a new address and keys. This means:

✅ **Great for learning**: Safe to experiment with  
⚠️ **Remember**: Any funds will be "lost" when you restart (since you get a new address)

**In real applications**, you'd save and load your private key securely. We'll cover proper wallet storage in advanced tutorials!

## What You Just Achieved!

Congratulations! You now have:

- **A unique blockchain identity**
- **The ability to receive NIM** at your address  
- **A wallet that can sign transactions**
- **Your first step** toward building payment applications

## Next: Getting Test Funds! 🚰

In the next lesson, we'll get some free testnet NIM from the faucet to fund your wallet. Then you can start sending your first blockchain transactions!
