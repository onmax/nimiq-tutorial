import * as Nimiq from '@nimiq/core'

console.log('Starting Nimiq client...')

// TODO: Import Entropy from @nimiq/utils

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
    
    // TODO: Generate a new wallet with entropy
    
    // TODO: Display wallet information (address and public key)
    
    // TODO: Check and display wallet balance
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
