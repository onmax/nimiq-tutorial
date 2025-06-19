---
type: lesson
title: Understanding Hash Time Locked Contracts (HTLC)
focus: /index.js
terminal:
  panels: ['output']
---

# Understanding Hash Time Locked Contracts (HTLC) 🔐⏰

Hash Time Locked Contracts (HTLCs) are a fundamental cryptographic primitive that enables secure, trustless transactions with time-based conditions. In Nimiq, HTLCs are the foundation for creating **cashlinks** - shareable payment links that can be claimed by anyone with the correct secret.

## What is an HTLC?

An HTLC is a smart contract that locks funds until two conditions are met:

1. **Hash condition** 🔍: The recipient must provide a secret (preimage) that matches a specific hash
2. **Time condition** ⏰: The funds must be claimed before a timeout expires

If the hash condition isn't met before the timeout, the funds are returned to the sender.

## HTLC Components

Every HTLC has these essential components:

- **Sender** 👤: The address that creates and funds the HTLC
- **Recipient** 📍: The address that can claim the funds (if they know the secret)
- **Hash Root** 🔐: The hash of the secret required to claim the funds
- **Hash Algorithm** 🧮: The hashing algorithm used (usually SHA-256)
- **Hash Count** 🔢: Number of times the secret is hashed (for added security)
- **Timeout** ⏰: Block height when the HTLC expires and funds return to sender
- **Amount** 💰: The amount of NIM locked in the contract

## How Cashlinks Work

Cashlinks use HTLCs to create shareable payment links:

1. **Creation** 📝: Someone creates a cashlink by generating a secret and creating an HTLC
2. **Sharing** 🔗: The cashlink URL contains the secret and HTLC address
3. **Claiming** 💰: Anyone with the link can claim the funds using the embedded secret

## Your First HTLC Explorer

In this lesson, we'll explore existing HTLCs on the Nimiq testnet and understand their structure.

Looking at the `index.js` file, you can see we have the connection setup ready. Let's add HTLC exploration functionality.

## Step 1: Import HTLC Classes

First, let's import the necessary classes for working with HTLCs:

```js
import { HashedTimeLockedContract } from '@nimiq/core'
```

## Step 2: Explore HTLC Structure

Let's create a function to examine HTLC accounts on the network:

```js
async function exploreHTLC(address) {
    console.log(`🔍 Exploring HTLC at address: ${address}`)
    
    try {
        const account = await client.getAccount(address)
        console.log('📊 Account Type:', account.type)
        
        if (account.type === 'htlc') {
            console.log('🎯 Found HTLC Contract!')
            console.log('├─ Balance:', account.balance / 1e5, 'NIM')
            console.log('├─ Sender:', account.sender)
            console.log('├─ Recipient:', account.recipient)
            console.log('├─ Hash Root:', account.hashRoot)
            console.log('├─ Hash Algorithm:', account.hashAlgorithm)
            console.log('├─ Hash Count:', account.hashCount)
            console.log('├─ Timeout:', account.timeout)
            console.log('└─ Total Amount:', account.totalAmount / 1e5, 'NIM')
        } else {
            console.log('❌ This is not an HTLC contract')
        }
    } catch (error) {
        console.error('❌ Error exploring HTLC:', error.message)
    }
}
```

## Step 3: Generate Sample HTLC Data

Let's create a function to understand how HTLC data is structured:

```js
function demonstrateHTLCConcepts() {
    console.log('\n🧠 HTLC Concepts Demonstration:')
    
    // Generate a sample secret
    const secret = 'Hello Nimiq HTLC!'
    console.log('🔐 Secret:', secret)
    
    // Convert to bytes and hash it
    const secretBytes = new TextEncoder().encode(secret)
    console.log('📊 Secret as bytes:', Array.from(secretBytes))
    
    // This is what would be stored in the HTLC hash root
    // (In real implementation, this would use proper crypto hashing)
    console.log('🔗 Hash concept: The HTLC stores a hash of this secret')
    console.log('✅ To claim: Provide the secret that matches the hash')
    console.log('⏰ If timeout: Funds return to sender automatically')
}
```

## Step 4: Check Current Block Height

HTLCs use block heights for timeouts, so let's check the current network state:

```js
async function checkNetworkState() {
    console.log('\n🌐 Network State:')
    
    try {
        const head = await client.getHeadBlock()
        console.log('📏 Current Block Height:', head.height)
        console.log('⏰ Block Timestamp:', new Date(head.timestamp * 1000).toLocaleString())
        
        // Example timeout calculation
        const futureTimeout = head.height + 1000 // 1000 blocks in the future
        console.log(`🔮 Example HTLC timeout: Block ${futureTimeout}`)
        console.log('   (Approximately 1000 minutes from now)')
    } catch (error) {
        console.error('❌ Error getting network state:', error.message)
    }
}
```

## Step 5: Run the Exploration

Add this to execute our exploration:

```js
// Run the HTLC exploration
async function runHTLCExploration() {
    console.log('🚀 Starting HTLC Exploration...\n')
    
    // Demonstrate HTLC concepts
    demonstrateHTLCConcepts()
    
    // Check network state
    await checkNetworkState()
    
    // Try to explore a sample HTLC address (this might not exist)
    console.log('\n🔍 Attempting to find HTLC contracts...')
    console.log('(Most addresses will be basic accounts, not HTLCs)')
    
    // In a real scenario, you'd have actual HTLC addresses to explore
    // For now, we'll just demonstrate the concept
}

// Execute after connection is established
runHTLCExploration()
```

## Key Concepts Learned

- **HTLC Structure**: Understanding the components of Hash Time Locked Contracts
- **Timeout Mechanism**: How block heights control when contracts expire
- **Hash Preimage**: The secret that unlocks the contract
- **Account Types**: How HTLCs appear as special account types on the blockchain

## Real-World Applications

HTLCs enable many powerful use cases:

- **Cashlinks** 🔗: Shareable payment links (our main focus)
- **Atomic Swaps** 🔄: Cross-chain transactions
- **Payment Channels** ⚡: Lightning-style instant payments
- **Conditional Payments** 📋: Payments that require specific conditions

## Next Steps

In the next lesson, we'll learn how to create our first cashlink by building an HTLC from scratch! 🛠️

> 💡 **Note**: HTLCs are powerful but complex. Take time to understand these concepts before moving to implementation. 
