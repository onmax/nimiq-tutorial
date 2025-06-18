import { Client, ClientConfiguration } from '@nimiq/core'

/**
 * Create and connect to the Nimiq network
 * @param {string} network - Network to connect to ('TestAlbatross' or 'MainAlbatross')
 * @returns {Promise<Client>} - Connected Nimiq client
 */
export async function getClient(network = 'TestAlbatross') {
  console.log('🚀 Starting Nimiq client...')

  // Create client configuration
  const config = new ClientConfiguration()

  config.network(network)

  // We must explicitly set the seed nodes for testnet
  if (network === 'TestAlbatross') {
    config.seedNodes([
      '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
    ])
  }

  // Connect using pico which is faster
  // Read more at: https://www.nimiq.com/developers/learn/protocol/sync-protocol/nodes-and-sync
  config.syncMode('pico')

  // Print minimal messages
  config.logLevel('error')

  // Create the client instance
  const client = await Client.create(config.build())
  console.log('⏳ Client created, waiting for consensus...')

  // Wait for consensus
  await client.waitForConsensusEstablished()
  console.log('✅ Consensus established!')

  return client
}
