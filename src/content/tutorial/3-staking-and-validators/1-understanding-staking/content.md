---
type: lesson
title: Understanding Staking and Validators
focus: /index.js
terminal:
  panels: ['output']
---

# Staking Your NIM and Earning Rewards!

Welcome to the world of Proof-of-Stake (PoS)! You're about to learn how to make your NIM work for you by participating in network security and earning rewards.

## What You'll Learn

In this lesson, you'll understand:

- **What staking is** and how it secures the Nimiq network
- The roles of **validators and stakers**
- How to **earn rewards** by delegating your NIM
- How to get a list of active validators to start your staking journey

## Quick Preview

Here's a sneak peek at how you'll fetch the list of available validators:

```javascript
// 1. Connect to the Nimiq Mainnet
const client = await getClient('MainAlbatross')

// 2. Define the staking contract address
const STAKING_CONTRACT_ADDRESS = 'NQ77 0000 0000 0000 0000 0000 0000 0000 0001'

// 3. Retrieve the staking contract's account data
const contract = await client.getAccount(STAKING_CONTRACT_ADDRESS)

// 4. Extract and display the list of active validators
const activeValidators = contract.activeValidators.map(([address, balance]) => ({ address, balance: `${balance / 1e5} NIM` }))
console.table(activeValidators)
```

This simple command gives you all the information you need to choose a validator to stake with.

## Key Staking Concepts

Before we dive into the code, let's cover the basics.

### What Is Staking?

Staking is the process of locking up your NIM to help secure the network. In return, you earn rewards. It's like a savings account that also supports the blockchain.

- **Lock up NIM** to participate in network validation
- **Earn rewards** for helping secure the network
- **Support validators** who maintain the blockchain

### Validators and Stakers

- **Validators** are nodes that run the network. They process transactions and create new blocks. They are required to stake a significant amount of NIM.
- **Stakers** (like you!) are NIM holders who delegate their tokens to a validator. You share in the validator's rewards without needing to run your own hardware.

### The Reward System

- Rewards are distributed automatically every epoch (a set period of time).
- The more you stake, the more you earn.
- Your rewards are also dependent on the validator's performance.

## Your Task

Now, let's get your hands dirty. Your first step into the staking world is to find out which validators are available. To do this, you will query the Nimiq blockchain for the official staking contract. Let's use the Mainnet to see some real data!

### 1. Connect to Mainnet

First, let's connect to the Nimiq Mainnet to work with real-world data.

```javascript
const client = await getClient('MainAlbatross')
```

### 2. The Staking Contract

All staking operations in Nimiq are handled by a special smart contract called the **staking contract**. This contract holds information about validators, stakers, and their stakes.

To get validator information, you first need its address. The address for the main staking contract is always:
`NQ77 0000 0000 0000 0000 0000 0000 0000 0001`

Define it as a constant in your code:

```javascript
const STAKING_CONTRACT_ADDRESS = 'NQ77 0000 0000 0000 0000 0000 0000 0000 0001'
```

### 3. Fetching the Contract Account

With the address, you can use `client.getAccount()` to fetch the contract's current state. This is the same method you'd use to get any account's details.

```javascript
const contract = await client.getAccount(STAKING_CONTRACT_ADDRESS)
```

### 4. Finding the Active Validators

The returned `contract` object contains a wealth of information. The list of active validators is in the `activeValidators` property.

The data is structured as an array of tuples, where each tuple contains the validator's address and their total stake.

```javascript
const activeValidators = contract.activeValidators
```

### 5. Displaying the Validators

To make the list easier to read, you can format it. The stake is in Luna (the smallest unit of NIM), so you'll want to convert it to NIM by dividing by 100,000. Using `console.table()` will give you a nicely formatted output.

```javascript
const activeValidators = contract.activeValidators.map(([address, balance]) => ({
  address,
  balance: `${balance / 1e5} NIM`,
}))

console.table(formattedValidators)
```

Put it all together to see the list of staking partners available to you!
