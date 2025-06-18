import { Client, ClientConfiguration, Policy } from '@nimiq/core'

console.log('🚀 Starting Nimiq Staking Tutorial')

async function main() {
  try {
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
    
    // Get staking information
    console.log('\n📊 Staking Information:')
    
    // Get current epoch
    const headBlock = await client.getHeadBlock()
    const currentEpoch = Math.floor(headBlock.height / Policy.EPOCH_LENGTH)
    
    console.log(`📅 Current epoch: ${currentEpoch}`)
    console.log(`📏 Epoch length: ${Policy.EPOCH_LENGTH} blocks`)
    console.log(`🧱 Current block height: ${headBlock.height}`)
    console.log(`🔄 Blocks until next epoch: ${Policy.EPOCH_LENGTH - (headBlock.height % Policy.EPOCH_LENGTH)}`)
    
    // Get total supply
    const totalSupply = await client.getTotalSupply()
    console.log(`💰 Total supply: ${Policy.lunasToCoins(totalSupply)} NIM`)
    
    // Show staking economics
    console.log('\n💼 Staking Economics:')
    console.log(`🔒 Minimum stake: ${Policy.lunasToCoins(Policy.MINIMUM_STAKE)} NIM`)
    console.log(`⏰ Jail release delay: ${Policy.JAIL_RELEASE_DELAY} epochs`)
    console.log(`🚫 Slashing factor: ${Policy.SLASHING_FACTOR}%`)
    
    // Get all validators
    const validators = await client.getValidators()
    console.log(`\n👥 Total validators: ${validators.length}`)
    
    // Calculate total staked amount
    let totalStaked = 0
    let activeValidators = 0
    
    for (const validator of validators) {
      totalStaked += validator.balance
      if (validator.active) {
        activeValidators++
      }
    }
    
    console.log(`✅ Active validators: ${activeValidators}`)
    console.log(`🔒 Total staked: ${Policy.lunasToCoins(totalStaked)} NIM`)
    console.log(`📈 Staking ratio: ${((totalStaked / totalSupply) * 100).toFixed(2)}%`)
    
    // Show top 5 validators by stake
    const sortedValidators = validators
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5)
    
    console.log('\n🏆 Top 5 Validators by Stake:')
    sortedValidators.forEach((validator, index) => {
      console.log(`${index + 1}. ${validator.address.toUserFriendlyAddress()} - ${Policy.lunasToCoins(validator.balance)} NIM ${validator.active ? '✅' : '❌'}`)
    })
    
    console.log('📚 Staking concepts explained:')
    console.log('  🏛️  Validators: Secure the network and create blocks')
    console.log('  🤝 Delegators: Stake NIM with validators to earn rewards')
    console.log('  💰 Rewards: Earned each epoch based on stake and performance')
    console.log('  ⚖️  Slashing: Penalty for malicious validator behavior')
    
    console.log('✨ Ready to explore validators in the next lesson!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main().catch(console.error) 
