import * as Nimiq from '@nimiq/core'

console.log('Starting Nimiq client to explore validators...')

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
    
    // TODO: Query active validators
    // Hint: Use client.getActiveValidators()
    
    // TODO: Get current epoch information
    // Hint: Use client.getHeadBlock() and calculate epoch
    
    // TODO: Display validator information
    // Show address, stake, and other properties
    
    console.log('🔍 Ready to explore validators!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
