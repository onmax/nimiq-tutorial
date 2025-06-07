import * as Nimiq from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client...')

async function requestFromFaucet(address) {
  const faucetUrl = 'https://faucet.pos.nimiq-testnet.com/tapit'
  
  try {
    console.log('💧 Requesting funds from faucet...')
    
    const response = await fetch(faucetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `address=${address.toUserFriendlyAddress()}`
    })
    
    if (response.ok) {
      console.log('✅ Faucet request successful!')
      return true
    } else {
      console.log('❌ Faucet request failed:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Error requesting from faucet:', error.message)
    return false
  }
}

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
    
    // Check initial wallet balance
    const balance = await client.getBalance(wallet.address)
    console.log('Balance:', Nimiq.Policy.lunasToCoins(balance), 'NIM')
    
    // Request funds from faucet
    const faucetSuccess = await requestFromFaucet(wallet.address)
    
    if (faucetSuccess) {
      console.log('⏳ Waiting for faucet transaction to be processed...')
      
      // Wait for a few seconds
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Check balance again
      const newBalance = await client.getBalance(wallet.address)
      console.log('New Balance:', Nimiq.Policy.lunasToCoins(newBalance), 'NIM')
      
      if (newBalance > 0) {
        console.log('🎉 Successfully received testnet funds!')
      } else {
        console.log('⏳ Transaction might still be processing. Try checking again in a moment.')
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
