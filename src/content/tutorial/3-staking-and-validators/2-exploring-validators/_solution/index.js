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
 * Nimiq Staking Tutorial - Exploring Validators
 * 
 * This lesson demonstrates how to query and explore validator information from the Nimiq network.
 */

import { Policy } from '@nimiq/core'
import { posSupplyAt } from '@nimiq/utils/supply-calculator'
import { createAndConnectClient } from './consensus.js'
import { getActiveValidators, getStakingContract } from './lib/staking.js'

async function main() {
  console.log('🚀 Welcome to the Validator Explorer!')
  
  // Connect to the client
  const client = await createAndConnectClient('TestAlbatross')
  
  // Get staking contract information
  const stakingContract = await getStakingContract(client)
  console.log('\n🏛️ Staking Contract Information:')
  console.log(`  Address: ${stakingContract.address.toUserFriendlyAddress()}`)
  console.log(`  Total Stake: ${Policy.lunasToCoins(stakingContract.balance)} NIM`)
  
  // Get active validators
  const validators = await getActiveValidators(client)
  console.log(`\n✅ Found ${validators.length} active validators.`)

  // Log the top 5 validators by stake
  const sortedValidators = validators.sort((a, b) => b.balance - a.balance).slice(0, 5)
  console.log('\n🏆 Top 5 validators by stake:')
  for (const validator of sortedValidators) {
    console.log(`  - ${validator.address.toUserFriendlyAddress()}: ${Policy.lunasToCoins(validator.balance)} NIM`)
  }

  // Calculate and display total stake and staking ratio
  const totalStake = validators.reduce((sum, v) => sum + v.balance, 0)
  const circulatingSupply = posSupplyAt(Date.now(), { network: 'test-albatross' })
  console.log('\n📊 Staking Overview:')
  console.log(`  Total stake: ${Policy.lunasToCoins(totalStake)} NIM`)
  console.log(`  Circulating supply: ${circulatingSupply.toFixed(2)} NIM`)
  console.log(`  Staking ratio: ${((totalStake / (circulatingSupply * 1e5)) * 100).toFixed(2)}%`)
  
  console.log('\n✅ Validator exploration complete!')
}

main().catch(console.error) 
