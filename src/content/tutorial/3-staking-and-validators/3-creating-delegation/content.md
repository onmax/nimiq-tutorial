---
type: lesson
title: Creating Staking Delegation Transactions
focus: /index.js
---

# Creating Staking Delegation Transactions

## Overview

- **Create delegation transactions** to stake NIM with validators
- **Understand staking transaction types** (delegate, redelegate, unstake)
- **Handle staking contract interactions** through transactions
- **Learn about staking periods** and withdrawal delays

## Learning

Now let's learn how to create actual staking transactions to delegate NIM to validators and start earning rewards.

### Staking Transaction Types

Nimiq supports several types of staking transactions:

**Delegate:**
- Stakes NIM with a chosen validator
- Creates a new delegation or adds to existing one
- Rewards start accumulating immediately in the next epoch

**Redelegate:**
- Moves stake from one validator to another
- No waiting period (immediate effect)
- Useful for switching to better-performing validators

**Unstake:**
- Begins the process of withdrawing staked NIM
- Has a waiting period before funds can be withdrawn
- Stops earning rewards immediately

### Staking Contract Address

All staking operations are sent to the **staking contract**:
- Special contract address: `Nimiq.Address.CONTRACT_CREATION`
- Handles all delegation logic automatically
- Distributes rewards each epoch

### Transaction Structure

Staking transactions have a specific structure:

```javascript
const transaction = new Nimiq.Transaction(
  senderAddress,           // Your wallet address
  stakingContractAddress,  // Always the staking contract
  value,                   // Amount to stake (in Luna)
  fee,                     // Transaction fee
  validityStartHeight,     // Current block height
  Nimiq.Transaction.Type.BASIC, // Transaction type
  data                     // Staking-specific data
)
```

The `data` field contains encoded staking instructions that specify:
- Staking operation type (delegate/redelegate/unstake)
- Validator address (for delegation)
- Additional parameters

### Staking Considerations

**Minimum Amounts:**
- Most validators have minimum delegation amounts
- Check validator requirements before delegating

**Fees:**
- Standard transaction fees apply
- Consider fee costs for small delegations

**Timing:**
- Rewards start in the next epoch after delegation
- Unstaking has a waiting period (typically 14 days)

## Your Task

In this lesson, we'll:

1. **Set up a wallet** with testnet funds
2. **Choose a validator** to delegate to
3. **Create a delegation transaction** with proper staking data
4. **Sign and prepare** the transaction for sending

Complete the code to create your first staking delegation transaction! 
