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
    
    // Request funds from faucet
    const faucetSuccess = await requestFromFaucet(wallet.address)
    
    if (faucetSuccess) {
      console.log('⏳ Waiting for faucet transaction to be processed...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      const newBalance = await client.getBalance(wallet.address)
      console.log('Balance:', Nimiq.Policy.lunasToCoins(newBalance), 'NIM')
      
      if (newBalance > 0) {
        console.log('🎉 Successfully received testnet funds!')
        
        // Create a recipient address
        const recipientEntropy = Entropy.generate()
        const recipientAddress = Nimiq.Address.derive(recipientEntropy)
        console.log('📧 Recipient address:', recipientAddress.toUserFriendlyAddress())
        
        // Get current block height
        const currentHeight = await client.getBlockNumber()
        console.log('📊 Current block height:', currentHeight)
        
        // Create a basic transaction
        const transaction = new Nimiq.Transaction(
          wallet.address,
          recipientAddress,
          Nimiq.Policy.coinsToLunas(1),
          Nimiq.Policy.coinsToLunas(0.00001),
          currentHeight,
          Nimiq.Transaction.Type.BASIC
        )
        
        console.log('📝 Transaction created')
        
        // Sign the transaction
        const signature = Nimiq.Signature.create(wallet.keyPair.privateKey, wallet.keyPair.publicKey, transaction.serializeContent())
        const signedTransaction = new Nimiq.SignedTransaction(transaction, signature)
        
        console.log('✅ Transaction signed!')
        
        // Verify the signature
        const isValid = signedTransaction.verify()
        console.log('🔐 Signature valid:', isValid)
        
        // TODO: Send the basic transaction to the network
        
        // TODO: Create a transaction with data field
        
        // TODO: Sign and send the extended transaction
        
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
