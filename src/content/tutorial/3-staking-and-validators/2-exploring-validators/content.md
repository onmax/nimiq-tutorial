---
type: lesson
title: Exploring Validators and Staking Pool
focus: /index.js
terminal:
  panels: ['output']
---

# Exploring Validators 🔍

Time to meet the validators! You're about to research and explore the network participants who will help you earn staking rewards. Think of this as "validator shopping" - finding the best partner for your staking journey.

## Why Validator Selection Matters

Choosing the right validator directly impacts your staking success:

✅ **Higher Rewards** - Performance affects your earnings  
✅ **Reliable Payouts** - Uptime determines consistent rewards  
✅ **Trust & Security** - Validator behavior affects your staked funds  
✅ **Long-term Partnership** - Your chosen validator manages your stake

## What You'll Discover

By exploring validators, you'll learn to evaluate:

✅ **Stake amounts** and voting power  
✅ **Performance metrics** and reliability  
✅ **Reward policies** and payout addresses  
✅ **Validator status** and activity levels

## Validator Deep Dive

Each validator has key properties that affect your staking experience:

#### Validator Address 📍
- Unique identifier for each validator
- What you'll use when creating your delegation transaction
- Like a validator's "account number"

#### Stake Amount 💰
- Total NIM staked by validator + all their stakers
- Determines voting power and block production chances
- Higher stake often means more frequent rewards

#### Reward Address 🎁
- Where the validator receives their earned rewards
- Can differ from their main validator address
- Shows how they manage their earnings

#### Validator Status ⚡
- **Active**: Currently validating and earning rewards
- **Inactive**: Not participating (possibly penalized or offline)
- Only stake with active validators!

## The Staking Contract Hub

Nimiq uses a central **staking contract** that manages everything:

- **Single address** handles all network staking
- **Automatic distributions** every epoch
- **Transparent tracking** of all delegations
- **On-chain verification** of all staking activity

## Nimiq Validators API: Your Research Tool

Beyond basic network queries, the Validators API provides powerful research data:

#### **Key Endpoints** 🔗
- `/api/v1/validators` - Complete validator list with filters
- `/api/v1/validators/:address` - Detailed validator information  
- `/api/v1/supply` - Network staking statistics

#### **Enhanced Research Features** ⭐
- **Validator Trust Score (VTS)** - Performance and reliability ratings
- **Historical performance** - 9+ months of track record data
- **Rich metadata** - Descriptions, logos, contact info, payout policies
- **Network analytics** - Staking distribution and decentralization metrics

#### **API Networks** 🌐
- **Mainnet**: `https://validators-api-mainnet.pages.dev`
- **Testnet**: `https://validators-api-testnet.pages.dev`

## Your Validator Research Mission

In this lesson, you'll become a validator detective by:

1. **Connecting to the Network** 🔌 - Establish your research connection
2. **Querying Active Validators** 👥 - See who's currently validating  
3. **Analyzing Staking Data** 📈 - Understand total network stake
4. **Exploring Epoch Information** ⏰ - Learn about reward cycles

## What You'll Learn to Evaluate

**Performance Indicators:**
- Uptime and reliability history
- Reward consistency and timing
- Total stake and delegator count

**Trust Factors:**
- Validator description and transparency
- Contact information and communication
- Community reputation and involvement

**Economic Factors:**
- Fee structures and payout policies
- Stake concentration and decentralization
- Historical reward rates

## Your Staking Success Depends on This!

Just like choosing a bank or investment advisor, selecting the right validator is crucial for your staking success. The research you do here will directly impact:

- How much you earn in rewards
- How reliably you receive payouts  
- How secure your staked funds remain
- How smooth your staking experience will be

In this lesson, we'll:

1. **Connect to the network** 🔌 and establish consensus
2. **Query active validators** 👥 and display their information
3. **Get staking contract details** 📋 and total staked amounts
4. **Explore epoch information** ⏰ and validator statistics

The code will help you query live validator data and make informed decisions about where to stake your NIM! 🌟

## Ready to Research?

Let's start exploring validators and gathering the data you need to make smart staking decisions. You're about to become a validator expert! 🔍
