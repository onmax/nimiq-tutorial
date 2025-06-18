import * as Nimiq from '@nimiq/core'

/**
 * Utility functions for staking operations
 */

/**
 * Get and display active validators
 * @param {Nimiq.Client} client - The Nimiq client
 * @returns {Promise<Array>} - Array of active validators
 */
export async function getActiveValidators(client) {
  console.log('🏛️  Querying active validators...')
  const validators = await client.getActiveValidators()
  
  console.log(`📋 Found ${validators.length} active validators`)
  return validators
}

/**
 * Display validator information in a formatted way
 * @param {Array} validators - Array of validators
 */
export function displayValidators(validators) {
  let totalStake = 0
  
  validators.forEach((validator, index) => {
    const stakeNim = Nimiq.Policy.lunasToCoins(validator.numStakers)
    totalStake += validator.numStakers
    
    console.log(`\n${index + 1}. Validator ${validator.address.toUserFriendlyAddress()}`)
    console.log(`   💰 Stake: ${stakeNim.toFixed(2)} NIM`)
    console.log(`   🎯 Reward Address: ${validator.rewardAddress.toUserFriendlyAddress()}`)
    console.log(`   📊 Stakers: ${validator.numStakers}`)
  })
  
  console.log('\n📈 Network Staking Summary:')
  console.log(`  Total Active Validators: ${validators.length}`)
  console.log(`  Total Stake: ${Nimiq.Policy.lunasToCoins(totalStake).toFixed(2)} NIM`)
  console.log(`  Average Stake per Validator: ${Nimiq.Policy.lunasToCoins(totalStake / validators.length).toFixed(2)} NIM`)
}

/**
 * Create a delegation transaction
 * @param {Object} wallet - Sender wallet
 * @param {Nimiq.Address} validatorAddress - Validator to delegate to
 * @param {number} delegationAmount - Amount to delegate in Luna
 * @param {number} currentHeight - Current block height
 * @returns {Nimiq.Transaction} - Created delegation transaction
 */
export function createDelegationTransaction(wallet, validatorAddress, delegationAmount, currentHeight) {
  // Create staking data for delegation
  const stakingData = new Nimiq.StakingDataBuilder()
    .delegate(validatorAddress)
    .build()
  
  // Get staking contract address
  const stakingContract = Nimiq.Address.CONTRACT_CREATION
  
  // Create the transaction
  return new Nimiq.Transaction(
    wallet.address,
    stakingContract,
    delegationAmount,
    Nimiq.Policy.coinsToLunas(0.00001), // Standard fee
    currentHeight,
    Nimiq.Transaction.Type.BASIC,
    stakingData
  )
}

/**
 * Create an unstaking transaction
 * @param {Object} wallet - Sender wallet
 * @param {number} unstakeAmount - Amount to unstake in Luna
 * @param {number} currentHeight - Current block height
 * @returns {Nimiq.Transaction} - Created unstaking transaction
 */
export function createUnstakingTransaction(wallet, unstakeAmount, currentHeight) {
  // Create staking data for unstaking
  const stakingData = new Nimiq.StakingDataBuilder()
    .unstake(unstakeAmount)
    .build()
  
  // Get staking contract address
  const stakingContract = Nimiq.Address.CONTRACT_CREATION
  
  // Create the transaction
  return new Nimiq.Transaction(
    wallet.address,
    stakingContract,
    0, // No value for unstaking
    Nimiq.Policy.coinsToLunas(0.00001), // Standard fee
    currentHeight,
    Nimiq.Transaction.Type.BASIC,
    stakingData
  )
}

/**
 * Simulate reward monitoring and projections
 * @param {number} delegationAmount - Initial delegation amount in Luna
 * @param {Nimiq.Address} validatorAddress - Validator address
 * @param {number} annualAPY - Annual percentage yield (default: 0.07 = 7%)
 */
export function simulateRewardMonitoring(delegationAmount, validatorAddress, annualAPY = 0.07) {
  console.log('\n🎬 Simulating reward monitoring over time...')
  
  const epochsPerYear = 365 * 24 // Assuming ~1 epoch per hour
  const rewardPerEpoch = delegationAmount * (annualAPY / epochsPerYear)
  
  let totalRewards = 0
  let stakedAmount = delegationAmount
  
  console.log('\n📈 Projected Reward Accumulation:')
  console.log(`Initial Stake: ${Nimiq.Policy.lunasToCoins(delegationAmount)} NIM`)
  console.log(`Estimated APY: ${(annualAPY * 100).toFixed(1)}%`)
  console.log(`Reward per Epoch: ~${Nimiq.Policy.lunasToCoins(rewardPerEpoch).toFixed(6)} NIM`)
  
  // Simulate first 10 epochs
  for (let epoch = 1; epoch <= 10; epoch++) {
    const epochReward = rewardPerEpoch
    totalRewards += epochReward
    stakedAmount += epochReward // Compound rewards
    
    console.log(`\nEpoch ${epoch}:`)
    console.log(`  💰 Reward: +${Nimiq.Policy.lunasToCoins(epochReward).toFixed(6)} NIM`)
    console.log(`  📊 Total Rewards: ${Nimiq.Policy.lunasToCoins(totalRewards).toFixed(6)} NIM`)
    console.log(`  🎯 Total Staked: ${Nimiq.Policy.lunasToCoins(stakedAmount).toFixed(6)} NIM`)
  }
  
  // Show longer-term projections
  console.log('\n📊 Long-term Projections:')
  
  const monthlyReward = delegationAmount * (annualAPY / 12)
  const yearlyReward = delegationAmount * annualAPY
  
  console.log(`Monthly Rewards: ~${Nimiq.Policy.lunasToCoins(monthlyReward).toFixed(2)} NIM`)
  console.log(`Yearly Rewards: ~${Nimiq.Policy.lunasToCoins(yearlyReward).toFixed(2)} NIM`)
  console.log(`Year-end Balance: ~${Nimiq.Policy.lunasToCoins(delegationAmount + yearlyReward).toFixed(2)} NIM`)
}

/**
 * Display staking tips and best practices
 */
export function displayStakingTips() {
  console.log('\n💡 Staking Tips:')
  console.log('  🔄 Rewards are automatically compounded each epoch')
  console.log('  📈 Monitor validator performance for optimal returns')
  console.log('  ⏰ Unstaking has a ~14 day waiting period')
  console.log('  🏛️  Consider diversifying across multiple validators')
  console.log('  ⚖️  Be aware of slashing risks with your chosen validator')
} 
