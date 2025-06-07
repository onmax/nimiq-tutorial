---
type: lesson
title: Exploring Validators and Staking Pool
focus: /index.js
---

# Exploring Validators and Staking Information

## Overview

- **Query active validators** from the Nimiq network
- **Understand validator properties** like stake, reward address, and status
- **Explore the staking contract** and delegation information
- **Learn about validator selection** and epoch mechanics

## Learning

Now that we understand staking concepts, let's explore the actual validators on the network and learn how to query staking information.

### Validator Information

Each validator has several important properties:

**Validator Address:**
- Unique identifier for the validator
- Used when creating delegation transactions

**Stake Amount:**
- Total NIM staked by the validator and their delegators
- Determines validator's voting power and block production probability

**Reward Address:**
- Address where validator rewards are sent
- Can be different from the validator's signing address

**Status:**
- Active: Currently participating in consensus
- Inactive: Not participating (possibly jailed or voluntarily inactive)

### Staking Contract

Nimiq uses a special **staking contract** to manage all delegation:

- **Single contract address** for all staking operations
- **Automatic reward distribution** each epoch
- **Transparent delegation tracking** on-chain

### Querying Network Information

We can query various staking-related information:

1. **Active validators** and their properties
2. **Total staked amount** across the network
3. **Current epoch** and staking parameters
4. **Individual delegations** and their status

## Your Task

In this lesson, we'll:

1. **Connect to the network** and establish consensus
2. **Query active validators** and display their information
3. **Get staking contract details** and total staked amounts
4. **Explore epoch information** and validator statistics

Complete the code to query and display validator information from the Nimiq network! 
