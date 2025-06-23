---
type: lesson
title: 'Exploring Validators: From Address to Identity'
focus: /index.js
terminal:
  panels: ['output']
---

# From Address to Identity

In the last lesson, you successfully fetched a list of active validator addresses directly from the Nimiq staking contract. While this is a great first step, a raw address doesn't tell you much about a validator's performance, reliability, or community standing. How do you choose the best one to delegate your stake to?

In this lesson, you'll level up your skills by enriching that on-chain data with valuable off-chain information from the [Nimiq Validators API](https://github.com/nimiq/validators-api). You'll learn how to combine these two data sources to create a comprehensive overview of each validator, including their name, fees, and the crucial **Validator Trust Score (VTS)**.

## What You'll Learn

- How to fetch detailed validator metadata from an external API.
- How to calculate estimated annual staking rewards.
- The importance of the Validator Trust Score (VTS).
- How to merge on-chain and off-chain data to make informed decisions.

## Your Mission: Build a Rich Validator List

Your task is to create a script that fetches validator data from both the blockchain and the Nimiq Validators API, calculates potential rewards, and displays a sorted list of validators to help a user decide where to stake their NIM.

Let's get started!

### 1. Fetching Validator Metadata

First, you need data from the Nimiq Validators API. The `lib/validators-api.js` file already contains a helper function, `getValidators(network)`, which handles this for you. This function returns a detailed list of all validators, including their name, description, and fees.

Add this to your `index.js`:

```javascript
import { getValidators } from './lib/validators-api.js'

// ...

// Fetch additional data from Nimiq Validators API
const validatorsData = await getValidators(network)
```

### 2. Calculating Staking Rewards

To estimate how much you could earn by staking, you need two key pieces of information: the validator's fee and the percentage of the total NIM supply that is currently staked. A higher staked supply generally means slightly lower rewards for everyone, as the total rewards are shared among more participants.

The `lib/validators-api.js` file provides another helper, `getStakedSupplyRatio(network)`, to get this value.

```javascript
import { getStakedSupplyRatio } from './lib/validators-api.js'

// ...

const stakedSupplyRatio = await getStakedSupplyRatio(network)
```

With the `stakedSupplyRatio` and the validator's `fee`, you can use the `calculateStakingRewards` function from the `@nimiq/utils` package to estimate your potential earnings. This powerful utility does the heavy lifting for you.

Learn more about `@nimiq/utils` in the [documentation](https://www.nimiq.com/developers/build/nimiq-utils#nimiq-utils-js).

### 3. Merging On-Chain and Off-Chain Data

Now it's time to combine the data. You'll map over the `activeValidators` array you retrieved from the staking contract. For each validator, you'll:

1.  Find the corresponding metadata in `validatorsData`.
2.  Calculate their total stake in NIM.
3.  Use `calculateStakingRewards` to estimate the yearly reward percentage.
4.  Construct a new object with all the combined information.

```javascript
const enhancedValidators = contract.activeValidators.map(([address, balance]) => {
  const validatorInfo = validatorsData.find(v => v.address === address) || {}
  const totalStake = balance / 1e5 // Convert from Luna to NIM

  // Estimate yearly rewards ratio
  const { gainRatio } = calculateStakingRewards({
    stakedSupplyRatio,
    days: 365,
    fee: validatorInfo.fee,
  })

  return {
    'name': validatorInfo.name || 'N/A',
    address,
    'total stake (NIM)': totalStake.toFixed(2),
    'yearly reward (%)': (gainRatio * 100).toFixed(2),
    'fee %': validatorInfo.fee,
    'vts': validatorInfo.score?.total || 0,
  }
})
```

### 4. The Validator Trust Score (VTS)

You might have noticed the `vts` field. This is the **Validator Trust Score**, a metric developed by the Nimiq team to assess the reliability and performance of validators based on factors like uptime and participation in the network. A higher score indicates a more trustworthy validator. It's an essential tool for making a good staking choice. The `vts` is a value between 0 and 1.

For a deeper dive into how the score is calculated, you can read the [official documentation](https://www.nimiq.com/developers/validators/validator-trustscore).

### 5. Sort and Display

Finally, to make the list easy to read, sort it by the Validator Trust Score in descending order and print it to the console using `console.table()`. This will present the most reputable validators at the top.

```javascript
// Sort and display the final list
enhancedValidators.sort((a, b) => b.vts - a.vts)
console.table(enhancedValidators)
```

Run your script, and you'll see a beautiful, informative table of Nimiq validators, ready to help you make the best staking decision.
