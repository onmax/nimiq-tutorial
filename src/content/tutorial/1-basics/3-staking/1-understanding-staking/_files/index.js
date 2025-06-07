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
    
    // TODO: In the next lesson, we'll explore validators and staking information
    console.log('📚 Ready to explore staking concepts!')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
