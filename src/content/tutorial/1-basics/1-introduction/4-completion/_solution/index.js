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
  
  // Get and log the current block height
  const blockHeight = client.blockHeight
  console.log(`📊 Current block height: ${blockHeight}`)
  
  // Get and log the network ID
  const networkId = client.networkId
  console.log(`🌐 Connected to network: ${networkId}`)
  
  // Get and log head block information
  const headBlock = await client.getHeadBlock()
  console.log(`🧱 Head block hash: ${headBlock.hash}`)
  console.log(`⏰ Head block timestamp: ${new Date(headBlock.timestamp * 1000)}`)
}

main().catch(console.error) 
