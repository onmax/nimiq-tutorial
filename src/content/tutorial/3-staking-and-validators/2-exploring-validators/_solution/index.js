import { Client, ClientConfiguration, Policy } from '@nimiq/core'

async function main() {
  console.log('🚀 Starting Nimiq Validator Explorer')
  
  // Create a configuration builder
  const config = new ClientConfiguration()
  
  // We can also use `MainAlbatross` for mainnet
  config.network('TestAlbatross')

  // We must explicitly set the seed nodes for testnet
  config.seedNodes([
    '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
  ])
  
  // Connect using pico which is faster
  // Read more at: https://www.nimiq.com/developers/learn/protocol/sync-protocol/nodes-and-sync
  config.syncMode('pico')
  
  // Print minimal messages
  config.logLevel('error')
  
  // Instantiate and launch the client
  console.log('📡 Creating client and connecting to network...')
  const client = await Client.create(config.build())
  
  // Wait for consensus to be established
  console.log('⏳ Waiting for consensus to be established...')
  await client.waitForConsensusEstablished()
  
  console.log('✅ Consensus established!')
  
  // Get all validators
  console.log('\n🔍 Fetching validator information...')
  const validators = await client.getValidators()
  
  console.log(`\n👥 Found ${validators.length} validators`)
  
  // Analyze validator data
  let activeCount = 0
  let totalStake = 0
  let inactiveValidators = []
  
  for (const validator of validators) {
    totalStake += validator.balance
    if (validator.active) {
      activeCount++
    } else {
      inactiveValidators.push(validator)
    }
  }
  
  console.log(`✅ Active validators: ${activeCount}`)
  console.log(`❌ Inactive validators: ${validators.length - activeCount}`)
  console.log(`💰 Total stake: ${Policy.lunasToCoins(totalStake)} NIM`)
  console.log(`📊 Average stake: ${Policy.lunasToCoins(totalStake / validators.length)} NIM`)
  
  // Sort validators by stake (descending)
  const sortedValidators = validators.sort((a, b) => b.balance - a.balance)
  
  // Show top 10 validators
  console.log('\n🏆 Top 10 Validators by Stake:')
  sortedValidators.slice(0, 10).forEach((validator, index) => {
    const status = validator.active ? '✅ Active' : '❌ Inactive'
    const jailed = validator.jailedFrom !== null ? '🔒 Jailed' : ''
    console.log(`${index + 1}. ${validator.address.toUserFriendlyAddress()}`)
    console.log(`   Stake: ${Policy.lunasToCoins(validator.balance)} NIM`)
    console.log(`   Status: ${status} ${jailed}`)
    console.log(`   Slots: ${validator.numSlots}`)
    console.log('')
  })
  
  // Show smallest validators
  console.log('\n🔍 Smallest 5 Validators by Stake:')
  sortedValidators.slice(-5).reverse().forEach((validator, index) => {
    const status = validator.active ? '✅ Active' : '❌ Inactive'
    console.log(`${index + 1}. ${validator.address.toUserFriendlyAddress()}`)
    console.log(`   Stake: ${Policy.lunasToCoins(validator.balance)} NIM`)
    console.log(`   Status: ${status}`)
    console.log('')
  })
  
  // Analyze validator distribution
  const stakeRanges = {
    small: { min: 0, max: 100000, count: 0 },
    medium: { min: 100000, max: 500000, count: 0 },
    large: { min: 500000, max: 1000000, count: 0 },
    whale: { min: 1000000, max: Infinity, count: 0 }
  }
  
  validators.forEach(validator => {
    const stake = Policy.lunasToCoins(validator.balance)
    if (stake <= 100000) stakeRanges.small.count++
    else if (stake <= 500000) stakeRanges.medium.count++
    else if (stake <= 1000000) stakeRanges.large.count++
    else stakeRanges.whale.count++
  })
  
  console.log('\n📈 Validator Distribution by Stake:')
  console.log(`🐟 Small (≤100K NIM): ${stakeRanges.small.count} validators`)
  console.log(`🐠 Medium (100K-500K NIM): ${stakeRanges.medium.count} validators`)
  console.log(`🐡 Large (500K-1M NIM): ${stakeRanges.large.count} validators`)
  console.log(`🐋 Whale (>1M NIM): ${stakeRanges.whale.count} validators`)
  
  // Show inactive/jailed validators if any
  if (inactiveValidators.length > 0) {
    console.log('\n❌ Inactive Validators:')
    inactiveValidators.forEach(validator => {
      const jailedInfo = validator.jailedFrom !== null ? ` (Jailed from epoch ${validator.jailedFrom})` : ''
      console.log(`• ${validator.address.toUserFriendlyAddress()} - ${Policy.lunasToCoins(validator.balance)} NIM${jailedInfo}`)
    })
  }
  
  // Calculate decentralization metrics
  const top10Stake = sortedValidators.slice(0, 10).reduce((sum, v) => sum + v.balance, 0)
  const decentralizationRatio = (top10Stake / totalStake) * 100
  
  console.log('\n🎯 Network Health Metrics:')
  console.log(`🏆 Top 10 validators control: ${decentralizationRatio.toFixed(2)}% of total stake`)
  console.log(`📊 Nakamoto coefficient: ~${Math.ceil(validators.length / 3)} (theoretical minimum for 33% attack)`)
  console.log(`🔄 Active validator ratio: ${((activeCount / validators.length) * 100).toFixed(2)}%`)
}

main().catch(console.error) 
