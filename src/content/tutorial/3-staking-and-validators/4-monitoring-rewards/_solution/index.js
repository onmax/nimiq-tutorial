/**
 * Nimiq Tutorial Utilities
 * 
 * This module exports commonly used functions across the tutorial lessons
 * to keep the main tutorial files clean and focused on learning objectives.
 */

// Client utilities
export {
  createAndConnectClient,
  getNetworkInfo,
  displayNetworkInfo
} from './client.js'

// Wallet utilities
export {
  createWallet,
  createWalletFromEntropy,
  displayWalletInfo,
  createBasicTransaction,
  signTransaction
} from './wallet.js'

// Faucet utilities
export {
  requestFromFaucet,
  waitForFaucetFunds
} from './faucet.js'

// Staking utilities
export {
  getActiveValidators,
  displayValidators,
  createDelegationTransaction,
  createUnstakingTransaction,
  simulateRewardMonitoring,
  displayStakingTips
} from './staking.js'

// Validators API utilities
export {
  getValidatorsApiUrl,
  fetchValidatorsFromApi,
  fetchValidatorFromApi,
  fetchSupplyFromApi,
  displayValidatorApiInfo,
  compareValidatorData,
  displayNetworkAnalytics
} from './validators-api.js'

/**
 * Nimiq Staking Tutorial - Monitoring Rewards
 * 
 * This lesson demonstrates how to monitor staking rewards and delegation status.
 */

import { Policy } from '@nimiq/core'
import { createAndConnectClient } from './consensus.js'
import { getWallet } from './lib/wallet.js'
import { getDelegation, getRewards, getValidator } from './lib/staking.js'

async function main() {
  console.log('🚀 Welcome to the Staking Rewards Monitor!')
  
  // Connect to the client
  const client = await createAndConnectClient('TestAlbatross')
  
  // Load the wallet
  const wallet = await getWallet()
  if (!wallet) {
    console.log('❌ Wallet not found. Please run the previous step to create a delegation.')
    return
  }
  console.log(`🔑 Wallet address: ${wallet.address.toUserFriendlyAddress()}`)
  
  // Get the current delegation
  const delegation = await getDelegation(client, wallet.address)
  if (!delegation) {
    console.log('❌ No delegation found for this wallet.')
    return
  }
  
  // Get the validator for the delegation
  const validator = await getValidator(client, delegation.validatorAddress)
  
  // Get the staking rewards
  const rewards = await getRewards(client, wallet.address)
  
  // Display the staking information
  console.log('\n📊 Staking Information:')
  console.log(`  Validator: ${validator.address.toUserFriendlyAddress()}`)
  console.log(`  Delegation: ${Policy.lunasToCoins(delegation.balance)} NIM`)
  console.log(`  Rewards: ${Policy.lunasToCoins(rewards)} NIM`)
  
  console.log('✅ Staking monitoring complete!')
}

main().catch(console.error) 
