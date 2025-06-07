---
type: lesson
title: Monitoring Staking Rewards and Performance
focus: /index.js
---

# Monitoring Staking Rewards and Performance

## Overview

- **Send staking transactions** to the network
- **Query delegation status** and staked amounts
- **Monitor reward accumulation** across epochs
- **Track validator performance** and your returns

## Learning

In this final staking lesson, we'll complete the staking cycle by sending our delegation transaction and learning how to monitor our staking rewards over time.

### Sending Staking Transactions

Once you've created and signed a staking transaction, you can send it to the network:

```javascript
const txHash = await client.sendTransaction(signedTransaction)
```

The transaction will be:
1. **Broadcast** to the network
2. **Included** in a block by validators
3. **Executed** by the staking contract
4. **Confirmed** after block finalization

### Monitoring Delegations

After your transaction is confirmed, you can query your delegation status:

**Check Staked Amount:**
- Query how much NIM you have delegated
- See which validator you're staking with
- View when the delegation was created

**Track Rewards:**
- Rewards accumulate each epoch (typically every few hours)
- Rewards are automatically added to your staked amount
- No need to manually claim rewards

### Epoch Mechanics

Understanding epochs is crucial for staking:

**Epoch Duration:**
- Fixed number of blocks per epoch
- Rewards are calculated and distributed at epoch boundaries
- Your first rewards appear in the epoch after delegation

**Reward Distribution:**
- Validators earn block rewards and fees
- Rewards are shared with delegators proportionally
- Higher-performing validators may earn more rewards

### Performance Metrics

Monitor these key metrics for your staking:

**Validator Performance:**
- **Uptime:** How often the validator is online and participating
- **Block Production:** Number of blocks produced vs. expected
- **Slashing Events:** Any penalties incurred by the validator

**Your Returns:**
- **APY (Annual Percentage Yield):** Expected yearly return
- **Reward Rate:** NIM earned per epoch
- **Compounding:** Rewards automatically restaked for compound growth

### Unstaking Process

When you want to withdraw your stake:

1. **Create unstaking transaction** targeting the staking contract
2. **Wait for the unbonding period** (typically 14 days)
3. **Withdraw funds** after the waiting period ends
4. **Rewards stop** accumulating immediately upon unstaking

## Your Task

In this lesson, we'll:

1. **Send the delegation transaction** from the previous lesson
2. **Wait for confirmation** and check transaction status
3. **Query our delegation** to verify it was successful
4. **Monitor rewards** over time (simulation)

Complete the final piece of the staking puzzle! 
