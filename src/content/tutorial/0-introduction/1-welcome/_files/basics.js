import { createAndConnectClient, getNetworkInfo } from './lib/consensus.js'

async function main() {
  console.log('🚀 Starting Nimiq Web Client Tutorial')
  const now = performance.now()

  // Create and connect client
  const client = await createAndConnectClient()
  console.log('📡 Creating client and connecting to network...')

  // Wait for consensus and get network info
  const info = await getNetworkInfo(client)
  console.log(`📈 Current block height: ${info.blockHeight}`)
  console.log(`🧑‍🔬 Head block hash: ${info.hash}`)
  console.log(`⏰ Head block timestamp: ${new Date(info.timestamp * 1000)}`)
  console.log(`🌐 Connected to network: ${info.networkId}`)

  const end = performance.now()
  console.log(`🕒 Time taken: ${end - now}ms`)
}

main().catch(console.error) 
