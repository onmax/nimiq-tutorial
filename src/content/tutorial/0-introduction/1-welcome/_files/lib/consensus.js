import { Client, ClientConfiguration } from '@nimiq/core'

export async function createAndConnectClient(network = 'TestAlbatross') {
  const config = new ClientConfiguration()
  config.network(network)
  config.seedNodes([
    '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
  ])
  config.syncMode('pico')
  config.logLevel('error')
  const client = await Client.create(config.build())
  await client.waitForConsensusEstablished()
  return client
}

export async function getNetworkInfo(client) {
  const headBlock = await client.getHeadBlock(true)
  return { blockHeight: headBlock.height, hash: headBlock.hash, timestamp: headBlock.timestamp, networkId: await client.getNetworkId() }
}
