/**
 * Nimiq Staking Tutorial - Understanding Staking
 * 
 * Learn about Nimiq's staking mechanism and validator ecosystem
 */

import * as Nimiq from '@nimiq/core'
import { SupplyCalculator } from '@nimiq/utils'
import { createAndConnectClient, getNetworkInfo } from './client.js'
import { getActiveValidators } from './staking.js'
import { fetchValidators } from './validators-api.js'

console.log('🏛️  Welcome to Nimiq Staking Tutorial!')

async function main() {
  try {
    // Connect to the network (using external utility from parts 1 & 2)
    const client = await createAndConnectClient('TestAlbatross')
    
    // Get current network information
    const { blockHeight, currentEpoch, epochLength } = await getNetworkInfo(client)
    console.log('\n📊 Network Status:')
    console.log(`Block Height: ${blockHeight}`)
    console.log(`Current Epoch: ${currentEpoch}`)
    console.log(`Blocks per Epoch: ${epochLength}`)
    
    // Step 1: Get validators from the network
    console.log('\n🔍 Step 1: Getting validators from the network...')
    const networkValidators = await getActiveValidators(client)
    
    // Display basic validator info using console.table
    const validatorSummary = networkValidators.slice(0, 5).map(validator => ({
      Address: validator.address.toUserFriendlyAddress().slice(0, 20) + '...',
      'Stake (NIM)': (validator.balance / 1e5).toFixed(2),
      Stakers: validator.numStakers
    }))
    
    console.log('\n📋 Top 5 Active Validators (from Network):')
    console.table(validatorSummary)
    
    // Step 2: Get enhanced validator data from API
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
        Website: validator.website ? '✅' : '❌'
      }))
    
    console.log('\n✨ Top 5 Validators with Enhanced Metadata (from API):')
    console.table(enhancedValidators)
    
    // Step 3: Understanding staking economics
    console.log('\n💰 Step 3: Understanding Staking Economics')
    
    // Calculate total stake in the network
    const totalNetworkStakeLunas = networkValidators.reduce((sum, v) => sum + v.balance, 0)
    const totalStakeNIM = totalNetworkStakeLunas / 1e5
    
    console.log(`Total Network Stake: ${totalStakeNIM.toFixed(2)} NIM`)
    console.log(`Active Validators: ${networkValidators.length}`)
    console.log(`Average Stake per Validator: ${(totalStakeNIM / networkValidators.length).toFixed(2)} NIM`)
    
    // Step 4: Simulate staking scenario
    console.log('\n🎯 Step 4: Staking Simulation')
    
    // Staking Simulation using @nimiq/utils
    // Constants (assuming these might come from Policy or a rewards module in utils)
    // These are illustrative; actual calculation might differ based on @nimiq/utils API
    const NIM_SUPPLY_MAX = 21e14 // Max supply in Lunas (21 million NIM * 1e5)
    const BLOCK_TIME_SECONDS = 60 // Approximate block time
    const BLOCKS_PER_YEAR = (365 * 24 * 60 * 60) / BLOCK_TIME_SECONDS

    // Get current total supply
    const supplyCalculator = new SupplyCalculator(client)
    const currentSupplyLunas = await supplyCalculator.getCurrentSupply()
    const currentSupplyNIM = currentSupplyLunas / 1e5

    // Estimate annual staking reward percentage (APY)
    // This is a simplified estimation. A real RewardsCalculator would be more accurate.
    // The actual reward depends on many factors including total staked amount, validator uptime, fees etc.
    // For this example, let's assume a function getAnnualRewardRate exists or can be derived.
    // This part would ideally use a dedicated rewards calculation utility from @nimiq/utils
    
    // Simplified APY placeholder - replace with actual calculation from @nimiq/utils if available
    const estimatedAnnualAPY = await supplyCalculator.estimateStakingAPY(totalNetworkStakeLunas)

    console.log(`💰 Staking Economics:`)
    console.log(`Total Network Stake: ${totalStakeNIM.toFixed(2)} NIM`)
    console.log(`Active Validators: ${networkValidators.length}`)
    console.log(`Average Stake per Validator: ${(totalStakeNIM / networkValidators.length).toFixed(2)} NIM`)

    console.log(`🎯 Staking Simulation (with @nimiq/utils estimates):`)
    if (typeof estimatedAnnualAPY === 'number') {
        console.log(`Estimated Annual Staking APY (network-wide): ${(estimatedAnnualAPY * 100).toFixed(2)}%`)
        const simulationAmountNIM = 1000 // 1000 NIM
        const monthlyRewardNIM = simulationAmountNIM * (estimatedAnnualAPY / 12)
        const yearlyRewardNIM = simulationAmountNIM * estimatedAnnualAPY

        console.log(`If you stake ${simulationAmountNIM} NIM:`)
        console.log(`- Estimated monthly reward: ~${monthlyRewardNIM.toFixed(2)} NIM`)
        console.log(`- Estimated yearly reward: ~${yearlyRewardNIM.toFixed(2)} NIM`)
        console.log(`- Your balance after 1 year (excluding compounding): ~${(simulationAmountNIM + yearlyRewardNIM).toFixed(2)} NIM`)
    } else {
        console.log("Could not estimate APY with available information from SupplyCalculator.")
        // Fallback to simpler previous simulation if APY estimation fails
        const simulationAmount = 1000 // 1000 NIM
        const fallbackAnnualAPY = 0.07 // 7% annual return
        const monthlyReward = simulationAmount * (fallbackAnnualAPY / 12)
        console.log(`Using fallback APY of ${(fallbackAnnualAPY * 100).toFixed(2)}% for simulation:`)
        console.log(`If you stake ${simulationAmount} NIM:`)
        console.log(`- Estimated monthly reward: ~${monthlyReward.toFixed(2)} NIM`)
        console.log(`- Estimated yearly reward: ~${(simulationAmount * fallbackAnnualAPY).toFixed(2)} NIM`)
    }
    
    console.log('\n✅ Tutorial completed! You now understand:')
    console.log('  • How to query network validators')
    console.log('  • How to fetch enhanced validator data from the API')
    console.log('  • Basic staking economics and reward calculations')
    
  } catch (error) {
    console.error('❌ Error:', error)
    if (error.message && error.message.includes('SupplyCalculator')) {
        console.error('Hint: Ensure @nimiq/utils is correctly installed and SupplyCalculator API is used as intended.')
    }
  }
}

main().catch(console.error) 
