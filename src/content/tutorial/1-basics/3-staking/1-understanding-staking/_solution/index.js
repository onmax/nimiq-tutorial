import * as Nimiq from '@nimiq/core'

console.log('Starting Nimiq client for staking exploration...')

async function main() {
  try {
    // Create client configuration
    const config = new Nimiq.ClientConfiguration()
    config.network('TestAlbatross')
    
    // Create the client instance
    const client = await Nimiq.Client.create(config.build())
    console.log('Client created, waiting for consensus...')
    
    // Wait for consensus
    await client.waitForConsensusEstablished()
    console.log('✅ Consensus established!')
    
    // Get current block information
    const currentBlock = await client.getHeadBlock()
    console.log('📊 Current block height:', currentBlock.height)
    console.log('📊 Current epoch:', Math.floor(currentBlock.height / Nimiq.Policy.EPOCH_LENGTH))
    
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

main() 
