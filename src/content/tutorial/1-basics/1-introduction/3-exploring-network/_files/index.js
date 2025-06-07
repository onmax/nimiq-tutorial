import * as Nimiq from '@nimiq/core'

async function main() {
  console.log('🚀 Starting Nimiq Web Client Tutorial')
  
  // Create a configuration builder
  const config = new Nimiq.ClientConfiguration()
  
  // Select Testnet
  config.network('TestAlbatross')
  
  // Instantiate and launch the client
  console.log('📡 Creating client and connecting to network...')
  const client = await Nimiq.Client.create(config.build())
  
  // Wait for consensus to be established
  console.log('⏳ Waiting for consensus to be established...')
  await client.waitForConsensusEstablished()
  
  console.log('✅ Consensus established!')
  
  // TODO: Get and log the current block height
  
  // TODO: Get and log the network ID
  
  // TODO: Get and log head block information
}

main().catch(console.error) 
