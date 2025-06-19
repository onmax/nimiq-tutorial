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
- **Use the Validators API** for enhanced validator data and analytics

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

### Nimiq Validators API

In addition to querying validators directly from the network, Nimiq provides a **Validators API** that offers enhanced data and analytics:

**API Endpoints:**
- **`/api/v1/validators`** - Retrieve the complete validator list with filtering options
- **`/api/v1/validators/:validator_address`** - Get detailed information about a specific validator
- **`/api/v1/supply`** - Retrieve supply status and staking metrics

**Enhanced Features:**
- **Validator Trust Score (VTS)** - Performance and reliability metrics
- **Historical data** - 9+ months of validator performance history
- **Rich metadata** - Validator descriptions, logos, contact information, payout policies
- **Network analytics** - Staking distribution, decentralization metrics

**API Base URLs:**
- **Mainnet:** `https://validators-api-mainnet.pages.dev`
- **Testnet:** `https://validators-api-testnet.pages.dev`

### Querying Network Information

We can query various staking-related information:

1. **Active validators** and their properties (via client or API)
2. **Total staked amount** across the network
3. **Current epoch** and staking parameters
4. **Individual delegations** and their status
5. **Validator performance metrics** and trust scores (via API)

## Your Task

In this lesson, we'll:

1. **Connect to the network** and establish consensus
2. **Query active validators** and display their information
3. **Get staking contract details** and total staked amounts
4. **Explore epoch information** and validator statistics

Complete the code to query and display validator information from the Nimiq network! 
