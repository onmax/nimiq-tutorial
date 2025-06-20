---
type: lesson
title: Monitoring Staking Rewards and Performance
focus: /index.js
terminal:
  panels: ['output']
---

# Monitoring Your Staking Rewards 📊

You've created your delegation transaction - now let's complete the staking cycle by sending it to the network and learning how to track your rewards and validator performance over time.

## What You'll Learn

In this final staking lesson, you'll:

✅ **Send your delegation** to the Nimiq network  
✅ **Monitor transaction confirmation** and status  
✅ **Track your staking rewards** as they accumulate  
✅ **Evaluate validator performance** for your delegation

## Sending Your Delegation

Once you've created and signed your staking transaction, you can broadcast it:

```javascript
const txHash = await client.sendTransaction(signedTransaction)
```

**What happens next:**
1. **Network broadcast** - Your transaction spreads across the network
2. **Block inclusion** - Validators include it in the next block
3. **Contract execution** - The staking contract processes your delegation
4. **Confirmation** - Your stake becomes active after block finalization

## Checking Your Delegation Status

After your transaction confirms, you can verify your delegation:

#### Staked Amount Verification
- Confirm how much NIM you've successfully delegated
- Verify which validator is managing your stake
- Check when your delegation became active

#### Reward Tracking
- Rewards accumulate automatically each epoch
- New rewards are added directly to your staked amount
- No manual claiming required - it's all automatic

## Understanding Epochs

Epochs are the heartbeat of Nimiq's reward system:

#### How Epochs Work
- **Fixed duration** - Each epoch lasts a set number of blocks
- **Reward cycles** - Rewards are calculated and distributed at epoch boundaries  
- **Activation timing** - Your first rewards appear in the epoch after delegation

#### Reward Distribution Process
- Validators earn rewards for producing blocks
- Rewards are shared proportionally with all their stakers
- Higher-performing validators typically generate better returns

## Key Performance Metrics

Monitor these indicators to evaluate your staking success:

#### Validator Performance
- **Uptime percentage** - How consistently your validator participates
- **Block production rate** - Blocks produced versus expected
- **Slashing history** - Any penalties that could affect your rewards

#### Your Staking Returns
- **APY (Annual Percentage Yield)** - Expected yearly return rate
- **Epoch rewards** - NIM earned per reward cycle
- **Compound growth** - Automatic restaking increases your stake over time

## The Unstaking Process

When you need to withdraw your staked NIM:

1. **Create unstaking transaction** - Signal your intent to withdraw
2. **Unbonding period** - Wait through the security delay (typically 14 days)
3. **Fund withdrawal** - Claim your NIM after the waiting period
4. **Reward cessation** - Earnings stop immediately when you unstake

## Implementation Steps

In this lesson, you'll complete your staking journey:

1. **Send Your Delegation** 📤 - Broadcast your transaction to the network
2. **Verify Confirmation** ✅ - Check that your delegation was successful  
3. **Query Delegation Status** 🔍 - Confirm your stake is active
4. **Simulate Reward Monitoring** 📈 - Learn how to track your earnings

## After This Lesson

Once you complete this tutorial, you'll understand the complete staking lifecycle:

✅ How to research and select validators  
✅ How to create and send delegation transactions  
✅ How to monitor your rewards and validator performance  
✅ How to manage your stake over time

## Getting Started

Let's send your delegation and start monitoring your staking rewards. You're about to complete your comprehensive staking education and see your first delegation in action on the Nimiq network. 
