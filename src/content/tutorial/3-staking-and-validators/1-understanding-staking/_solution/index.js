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

console.log('🏛️  Welcome to Nimiq Staking Tutorial!')

async function main() {
  try {
    // Connect to the network
    const client = await createAndConnectClient('TestAlbatross')

    // Get and display current network information
    const { blockHeight, currentEpoch, epochLength } = await getNetworkInfo(client)
    console.log('\n📊 Network Status:')
    console.log(`Block Height: ${blockHeight}`)
    console.log(`Current Epoch: ${currentEpoch}`)
    console.log(`Blocks per Epoch: ${epochLength}`)

    // Get validators from the network
    console.log('\n🔍 Step 1: Getting validators from the network...')
    const networkValidators = await getActiveValidators(client)

    // Display basic validator info using console.table
    const validatorSummary = networkValidators.slice(0, 5).map(validator => ({
      Address: validator.address.toUserFriendlyAddress().slice(0, 20) + '...',
      'Stake (NIM)': (validator.balance / 1e5).toFixed(2),
      Stakers: validator.numStakers,
    }))
    console.log('\n📋 Top 5 Active Validators (from Network):')
    console.table(validatorSummary)

    // Get enhanced validator data from API
    console.log('\n🌐 Step 2: Fetching enhanced data from Validators API...')
    const apiValidators = await fetchValidators('testnet')

    // Show validators with metadata using console.table
    const enhancedValidators = apiValidators
      .filter(v => v.name || v.description)
      .slice(0, 5)
      .map(validator => ({
        Name: validator.name || 'N/A',
        Address: validator.address.slice(0, 20) + '...',
        'Fee (%)': validator.fee ? (validator.fee * 100).toFixed(2) : 'N/A',
        Website: validator.website ? '✅' : '❌',
      }))
    console.log('\n✨ Top 5 Validators with Enhanced Metadata (from API):')
    console.table(enhancedValidators)

    // Calculate and display total stake in the network
    console.log('\n💰 Step 3: Understanding Staking Economics')
    const totalNetworkStakeLunas = networkValidators.reduce((sum, v) => sum + v.balance, 0)
    const totalStakeNIM = totalNetworkStakeLunas / 1e5
    console.log(`Total Network Stake: ${totalStakeNIM.toFixed(2)} NIM`)
    console.log(`Active Validators: ${networkValidators.length}`)
    console.log(`Average Stake per Validator: ${(totalStakeNIM / networkValidators.length).toFixed(2)} NIM`)

    // Staking Simulation using @nimiq/utils
    console.log('\n🎯 Step 4: Staking Simulation')
    const supplyCalculator = new SupplyCalculator(client)
    const estimatedAnnualAPY = await supplyCalculator.estimateStakingAPY(totalNetworkStakeLunas)

    if (typeof estimatedAnnualAPY === 'number') {
      console.log(`Estimated Annual Staking APY (network-wide): ${(estimatedAnnualAPY * 100).toFixed(2)}%`)
      const simulationAmountNIM = 1000 // 1000 NIM
      const monthlyRewardNIM = simulationAmountNIM * (estimatedAnnualAPY / 12)
      const yearlyRewardNIM = simulationAmountNIM * estimatedAnnualAPY

      console.log(`If you stake ${simulationAmountNIM} NIM:`)
      console.log(`- Estimated monthly reward: ~${monthlyRewardNIM.toFixed(2)} NIM`)
      console.log(`- Estimated yearly reward: ~${yearlyRewardNIM.toFixed(2)} NIM`)
    }
    else {
      console.log('Could not estimate APY with available information from SupplyCalculator.')
    }

    console.log('\n✅ Tutorial completed! You now understand:')
    console.log('  • How to query network validators')
    console.log('  • How to fetch enhanced validator data from the API')
    console.log('  • Basic staking economics and reward calculations')
  }
  catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error) 
