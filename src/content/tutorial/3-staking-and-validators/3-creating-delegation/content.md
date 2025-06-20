---
type: lesson
title: Creating Staking Delegation Transactions
focus: /index.js
terminal:
  panels: ['output']
---

# Creating Your First Delegation 📝

Now that you've researched validators and understand staking concepts, it's time to create your first delegation transaction. This lesson will guide you through the process of staking your NIM with a validator.

## What You'll Learn

By the end of this lesson, you'll have:

✅ **Created your first delegation** - Your NIM officially working for you  
✅ **Started earning rewards** - Passive income begins next epoch  
✅ **Joined the staking economy** - You're now a network participant  
✅ **Mastered staking transactions** - Complete control over your stake

## Staking Transaction Types

Nimiq supports several types of staking transactions:

#### Delegate 📈
- **What it does**: Stakes NIM with your chosen validator
- **When to use**: Starting new stake or adding to existing
- **Reward timeline**: Starts earning in the next epoch
- **Perfect for**: Getting your NIM working immediately

#### Redelegate 🔀
- **What it does**: Moves stake from one validator to another
- **When to use**: Switching to a better-performing validator
- **No waiting period**: Immediate switch, no lost time
- **Perfect for**: Optimizing your reward strategy

#### Unstake 📤
- **What it does**: Begins withdrawal of your staked NIM
- **When to use**: When you need your funds back
- **Waiting period**: Usually ~14 days before withdrawal
- **Perfect for**: Converting back to liquid NIM

## The Staking Contract

All staking operations are handled through Nimiq's **staking contract**:

- **Single destination**: All staking transactions go to one contract address
- **Automatic processing**: Handles delegation logic behind the scenes
- **Epoch rewards**: Distributes earnings to all participants
- **Transparent tracking**: Everything recorded on-chain

## Transaction Structure

Here's what your delegation transaction contains:

```javascript
// Create a staking delegation transaction
const transaction = new Nimiq.Transaction(
  senderAddress,                    // Your wallet (the source)
  stakingContractAddress,           // Staking contract (the destination)
  value,                           // Amount to stake (in Luna)
  fee,                            // Transaction fee
  validityStartHeight,            // Current block height
  Nimiq.Transaction.Type.BASIC,   // Transaction type
  data                           // Your staking instructions
)
```

**What makes it special**: The `data` field contains your staking instructions - which validator to delegate to and how much to stake.

## Staking Considerations

#### Minimum Amounts 💎
- Most validators set minimum delegation requirements
- Check your chosen validator's minimums first
- Start small to test the process

#### Transaction Fees 💸
- Standard Nimiq fees apply (currently free!)
- Consider fee costs for very small delegations
- Factor into your staking strategy

#### Timing Strategy ⏰
- **Delegation**: Rewards start next epoch (~few hours)
- **Unstaking**: Waiting period before you can withdraw
- **Redelegation**: Immediate effect, no waiting

## Implementation Steps

In this lesson, you'll:

1. **Set Up Your Funded Wallet** 💳 - Prepare your NIM for staking
2. **Select Your Validator** 🎯 - Choose from your research  
3. **Create the Delegation** 📝 - Build your staking transaction
4. **Sign and Send** ✍️ - Make it official on the blockchain

## After Delegation

Once your transaction is processed:

1. **Immediate confirmation** - Your delegation appears on-chain
2. **Validator recognition** - Your stake adds to their total
3. **Next epoch activation** - Rewards start automatically  
4. **Ongoing earnings** - Passive income every epoch
5. **Complete control** - Redelegate or unstake anytime

## Getting Started

This delegation transaction will stake your NIM with a validator, allowing you to participate in network security while earning rewards. 

Let's create your first delegation transaction and begin staking your NIM.
