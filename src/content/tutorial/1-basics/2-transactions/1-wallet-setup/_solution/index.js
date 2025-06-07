import * as Nimiq from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client...')

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
    
    // Generate a new wallet
    const entropy = Entropy.generate()
    const wallet = {
      keyPair: Nimiq.KeyPair.derive(entropy),
      address: Nimiq.Address.derive(entropy)
    }
    
    console.log('🎉 Wallet created successfully!')
    console.log('Address:', wallet.address.toUserFriendlyAddress())
    console.log('Public Key:', wallet.keyPair.publicKey.toHex())
    
    // Check wallet balance
    const balance = await client.getBalance(wallet.address)
    console.log('Balance:', Nimiq.Policy.lunasToCoins(balance), 'NIM')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
