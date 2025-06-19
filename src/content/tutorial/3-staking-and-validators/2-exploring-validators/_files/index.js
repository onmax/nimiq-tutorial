/**
 * Nimiq Staking Tutorial - Exploring Validators
 * 
 * Learn how to analyze and compare validators for staking decisions
 */

import * as Nimiq from '@nimiq/core'
import { createAndConnectClient } from './client.js'
import { getActiveValidators } from './staking.js'
import { fetchValidators } from './validators-api.js'

console.log('🔍 Welcome to Validator Explorer!')

async function main() {
  try {
    // Connect to the network
    const client = await createAndConnectClient('TestAlbatross')
    
    // Step 1: Get all network validators
    console.log('\n📋 Step 1: Getting all network validators...')
    const networkValidators = await getActiveValidators(client)
    
    // Step 2: Get enhanced validator data from API
    console.log('\n🌐 Step 2: Fetching enhanced validator data...')
    const apiValidators = await fetchValidators('testnet')
    
    // Step 3: Analyze validator performance metrics
    console.log('\n📊 Step 3: Validator Performance Analysis')
    
    // Sort validators by stake amount
    const sortedByStake = [...networkValidators]
      .sort((a, b) => b.numStakers - a.numStakers)
      .slice(0, 10)
    
    const topValidators = sortedByStake.map((validator, index) => ({
      Rank: index + 1,
      Address: validator.address.toUserFriendlyAddress().slice(0, 15) + '...',
      'Stake (NIM)': Nimiq.Policy.lunasToCoins(validator.numStakers).toFixed(0),
      'Stakers': validator.numStakers
    }))
    
    console.log('\n🏆 Top 10 Validators by Stake:')
    console.table(topValidators)
    
    // Step 4: Find validators with metadata
    console.log('\n✨ Step 4: Validators with Enhanced Information')
    
    const validatorsWithInfo = apiValidators
      .filter(v => v.name && v.description)
      .slice(0, 8)
      .map(validator => ({
        Name: validator.name,
        Address: validator.address.slice(0, 15) + '...',
        'Fee (%)': validator.fee ? (validator.fee * 100).toFixed(1) : 'N/A',
        Description: validator.description.slice(0, 40) + '...'
      }))
    
    console.table(validatorsWithInfo)
    
    // Step 5: Validator selection criteria
    console.log('\n🎯 Step 5: What to Look for in a Validator')
    console.log('When choosing a validator, consider:')
    console.log('  • Low fees (typically 0-5%)')
    console.log('  • Good uptime and performance history')
    console.log('  • Transparent communication')
    console.log('  • Active community involvement')
    console.log('  • Diversification (avoid over-concentration)')
    
    // Step 6: Show fee comparison
    const validatorsWithFees = apiValidators
      .filter(v => v.fee !== undefined)
      .sort((a, b) => a.fee - b.fee)
      .slice(0, 5)
    
    if (validatorsWithFees.length > 0) {
      console.log('\n💰 Validators by Fee (Lowest to Highest):')
      const feeComparison = validatorsWithFees.map(v => ({
        Name: v.name || 'Unknown',
        'Fee (%)': (v.fee * 100).toFixed(2),
        Address: v.address.slice(0, 15) + '...'
      }))
      console.table(feeComparison)
    }
    
    console.log('\n✅ Exploration completed! Next: Learn how to create a delegation')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error) 
