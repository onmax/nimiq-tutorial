---
type: lesson
title: Understanding Hash Time Locked Contracts (HTLC)
focus: /index.js
terminal:
  panels: ['output']
---

# Understanding HTLCs 🔐

Hash Time Locked Contracts (HTLCs) are smart contracts that enable secure, conditional payments. In Nimiq, HTLCs power **cashlinks** - shareable payment links that anyone can claim with the right secret.

## What You'll Learn

In this lesson, you'll understand:

✅ **How HTLCs work** - The basic mechanics of conditional payments  
✅ **HTLC components** - What makes up these smart contracts  
✅ **Cashlink foundation** - How HTLCs enable shareable payment links  
✅ **Practical applications** - Real-world uses for HTLCs

## What is an HTLC?

Think of an HTLC as a digital "treasure chest" that can only be opened under specific conditions:

#### Two Requirements to Unlock
1. **Hash preimage** - You must know the secret (preimage) that matches the hash
2. **Time limit** - You must claim it before a deadline expires

If both conditions aren't met, the funds automatically return to the sender.

## HTLC Components

Every HTLC contains these essential elements:

- **Sender** 👤 - The address that creates and funds the HTLC
- **Recipient** 📍 - The address that can claim the funds  
- **Hash Root** 🔐 - A cryptographic fingerprint of the secret
- **Hash Algorithm** 🧮 - The method used to create the fingerprint (usually SHA-256)
- **Hash Count** 🔢 - How many times the secret is hashed for security
- **Timeout** ⏰ - Block height when the HTLC expires
- **Amount** 💰 - The NIM locked in the contract

## How Cashlinks Use HTLCs

Cashlinks combine HTLCs with shareable URLs to create "digital gift cards":

1. **Creation** 📝 - Someone generates a secret and creates an HTLC
2. **Sharing** 🔗 - The cashlink URL contains both the secret and contract address
3. **Claiming** 💰 - Anyone with the link can unlock the funds using the embedded secret

## Exploring HTLC Structure

Let's examine how HTLCs appear on the blockchain and understand their data structure.

## Step 1: Import HTLC Classes 📦

First, add the necessary imports for working with HTLCs:

```js
// Import HTLC classes for working with contracts
import { HashedTimeLockedContract } from '@nimiq/core'
```

## Step 2: Explore HTLC Accounts 🔍

Create a function to examine HTLC contracts on the network:

```js
// Explore and display HTLC contract details
async function exploreHTLC(address) {
    console.log(`Exploring HTLC at address: ${address}`)
    
    try {
        const account = await client.getAccount(address)
        console.log('Account Type:', account.type)
        
        if (account.type === 'htlc') {
            console.log('Found HTLC Contract!')
            console.log('├─ Balance:', account.balance / 1e5, 'NIM')
            console.log('├─ Sender:', account.sender)
            console.log('├─ Recipient:', account.recipient)
            console.log('├─ Hash Root:', account.hashRoot)
            console.log('├─ Hash Algorithm:', account.hashAlgorithm)
            console.log('├─ Hash Count:', account.hashCount)
            console.log('├─ Timeout:', account.timeout)
            console.log('└─ Total Amount:', account.totalAmount / 1e5, 'NIM')
        } else {
            console.log('This is not an HTLC contract')
        }
    } catch (error) {
        console.error('Error exploring HTLC:', error.message)
    }
}
```

## Step 3: Demonstrate HTLC Concepts 💡

Create a function to show how secrets and hashes work:

```js
// Demonstrate how HTLC secrets and hashes work
function demonstrateHTLCConcepts() {
    console.log('\nHTLC Concepts Demonstration:')
    
    // Generate a sample secret
    const secret = 'Hello Nimiq HTLC!'
    console.log('Secret:', secret)
    
    // Convert to bytes for hashing
    const secretBytes = new TextEncoder().encode(secret)
    console.log('Secret as bytes:', Array.from(secretBytes))
    
    // Explain the hash preimage concept
    console.log('Hash concept: The HTLC stores a hash of this secret')
    console.log('To claim: Provide the preimage (secret) that matches the hash')
    console.log('If timeout: Funds return to sender automatically')
}
```

## Step 4: Check Network State 🌐

Since HTLCs use block heights for timeouts, let's check the current blockchain state:

```js
async function checkNetworkState() {
    console.log('\nNetwork State:')
    
    try {
        const head = await client.getHeadBlock()
        console.log('Current Block Height:', head.height)
        console.log('Block Timestamp:', new Date(head.timestamp * 1000).toLocaleString())
        
        // Example timeout calculation
        const futureTimeout = head.height + 1000
        console.log(`Example HTLC timeout: Block ${futureTimeout}`)
        console.log('(Approximately 1000 minutes from now)')
    } catch (error) {
        console.error('Error getting network state:', error.message)
    }
}
```

## Step 5: Run the Exploration 🚀

Execute the HTLC exploration:

```js
async function runHTLCExploration() {
    console.log('Starting HTLC Exploration...\n')
    
    // Demonstrate concepts
    demonstrateHTLCConcepts()
    
    // Check network state
    await checkNetworkState()
    
    // Note about finding HTLCs
    console.log('\nNote: Most addresses are basic accounts, not HTLCs')
    console.log('In the next lesson, we\'ll create our own HTLC contracts')
}

// Execute after connection is established
runHTLCExploration()
```

## Key Concepts

By exploring HTLCs, you've learned:

- **Contract structure** - How HTLCs store conditional payment data
- **Timeout mechanism** - How block heights control contract expiration
- **Hash preimage verification** - How providing the preimage unlocks contracts
- **Account types** - How HTLCs appear on the blockchain

## Real-World Applications

HTLCs enable several powerful use cases:

#### Payment Solutions
- **Cashlinks** - Shareable payment links for easy transfers
- **Conditional payments** - Payments that require specific conditions

#### Advanced Features  
- **Atomic swaps** - Trustless exchanges between different cryptocurrencies
- **Payment channels** - Fast, off-chain payment networks
- **Escrow services** - Secure, time-limited holding of funds

## Next Steps

Now that you understand how HTLCs work, you're ready to create your first cashlink! In the next lesson, we'll build an HTLC from scratch and generate a shareable payment link.

Understanding these concepts is essential before moving to implementation, as HTLCs form the foundation for all cashlink functionality.
