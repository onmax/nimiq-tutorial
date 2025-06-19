/**
 * Nimiq Staking Tutorial - Monitoring Rewards
 * 
 * Learn how to monitor staking rewards and understand reward calculations
 */

import * as Nimiq from '@nimiq/core'
import { createAndConnectClient, getNetworkInfo } from './client.js'
import { createWallet } from './wallet.js'
import { getActiveValidators } from './staking.js'

console.log('📊 Welcome to Reward Monitoring Tutorial!')

async function main() {
  try {
    // Connect to the network
    const client = await createAndConnectClient('TestAlbatross')
    const { blockHeight, currentEpoch, epochLength } = await getNetworkInfo(client)
    
    console.log('\n📊 Current Network Status:')
    console.log(`Block Height: ${blockHeight}`)
    console.log(`Current Epoch: ${currentEpoch}`)
    console.log(`Blocks per Epoch: ${epochLength}`)
    
    // Step 1: Create a sample wallet to demonstrate monitoring
    console.log('\n👛 Step 1: Setting up monitoring for a sample wallet...')
    const wallet = createWallet()
    console.log(`Sample Address: ${wallet.address.toUserFriendlyAddress()}`)
    
    // Step 2: Simulate staking data and rewards
    console.log('\n💰 Step 2: Understanding Reward Calculations')
    
    const simulatedStake = 1000 // 1000 NIM staked
    const annualAPY = 0.07 // 7% estimated APY
    const epochsPerYear = 365 * 24 // Assuming ~1 epoch per hour
    
    console.log(`Simulation Parameters:`)
    console.log(`  Staked Amount: ${simulatedStake} NIM`)
    console.log(`  Estimated APY: ${(annualAPY * 100).toFixed(1)}%`)
    console.log(`  Epochs per Year: ${epochsPerYear}`)
    
    // Calculate rewards per different time periods
    const rewardPerEpoch = simulatedStake * (annualAPY / epochsPerYear)
    const rewardPerDay = rewardPerEpoch * 24 // 24 epochs per day
    const rewardPerWeek = rewardPerDay * 7
    const rewardPerMonth = rewardPerDay * 30
    const rewardPerYear = simulatedStake * annualAPY
    
    const rewardBreakdown = [
      { Period: 'Per Epoch (~1 hour)', 'Reward (NIM)': rewardPerEpoch.toFixed(6) },
      { Period: 'Per Day', 'Reward (NIM)': rewardPerDay.toFixed(4) },
      { Period: 'Per Week', 'Reward (NIM)': rewardPerWeek.toFixed(2) },
      { Period: 'Per Month', 'Reward (NIM)': rewardPerMonth.toFixed(2) },
      { Period: 'Per Year', 'Reward (NIM)': rewardPerYear.toFixed(2) }
    ]
    
    console.log('\n📈 Estimated Reward Breakdown:')
    console.table(rewardBreakdown)
    
    // Step 3: Show compound growth over time
    console.log('\n🚀 Step 3: Compound Growth Simulation')
    
    let currentBalance = simulatedStake
    const monthsToShow = 12
    const compoundData = []
    
    for (let month = 1; month <= monthsToShow; month++) {
      const monthlyReward = currentBalance * (annualAPY / 12)
      currentBalance += monthlyReward
      
      compoundData.push({
        Month: month,
        'Balance (NIM)': currentBalance.toFixed(2),
        'Monthly Reward (NIM)': monthlyReward.toFixed(2),
        'Total Earned (NIM)': (currentBalance - simulatedStake).toFixed(2)
      })
    }
    
    console.log('\n📊 12-Month Compound Growth:')
    console.table(compoundData.filter((_, i) => i % 3 === 2 || i === 0 || i === monthsToShow - 1)) // Show every 3rd month
    
    // Step 4: Get real validator data for context
    console.log('\n🏛️  Step 4: Real Network Validator Data')
    const validators = await getActiveValidators(client)
    
    const totalNetworkStake = validators.reduce((sum, v) => sum + v.numStakers, 0)
    const totalStakeNIM = Nimiq.Policy.lunasToCoins(totalNetworkStake)
    
    console.log(`Total Network Stake: ${totalStakeNIM.toFixed(0)} NIM`)
    console.log(`Your Simulated Stake: ${simulatedStake} NIM`)
    console.log(`Your Network Share: ${((simulatedStake / totalStakeNIM) * 100).toFixed(4)}%`)
    
    // Step 5: Monitoring tips and best practices
    console.log('\n💡 Step 5: Monitoring Best Practices')
    console.log('\n🔍 How to Monitor Your Real Staking:')
    console.log('  • Check your balance regularly with client.getAccount(address)')
    console.log('  • Track validator performance and fees')
    console.log('  • Monitor network staking ratio for APY changes')
    console.log('  • Keep records for tax purposes')
    console.log('  • Consider rebalancing if validator performance changes')
    
    console.log('\n⚠️  Important Notes:')
    console.log('  • Rewards are automatically compounded each epoch')
    console.log('  • APY varies based on network conditions')
    console.log('  • Validator fees affect your final returns')
    console.log('  • Unstaking requires ~14 day waiting period')
    
    // Step 6: Example monitoring function
    console.log('\n📋 Step 6: Example Monitoring Code Structure')
    console.log('For real monitoring, you would:')
    console.log(`
// 1. Check account balance
const account = await client.getAccount(walletAddress)
const balance = Nimiq.Policy.lunasToCoins(account.balance)

// 2. Calculate rewards earned
const rewardsEarned = balance - originalStakeAmount

// 3. Track APY over time
const timeStaked = (Date.now() - stakeStartTime) / (1000 * 60 * 60 * 24 * 365)
const actualAPY = rewardsEarned / originalStakeAmount / timeStaked

// 4. Log results
console.log('Current Balance:', balance, 'NIM')
console.log('Rewards Earned:', rewardsEarned, 'NIM')
console.log('Actual APY:', (actualAPY * 100).toFixed(2), '%')
    `)
    
    console.log('\n✅ Reward monitoring tutorial completed!')
    console.log('You now understand how to calculate and monitor staking rewards.')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

main().catch(console.error) 
