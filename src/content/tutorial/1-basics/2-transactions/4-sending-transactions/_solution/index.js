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
        
        // Send the basic transaction
        if (isValid) {
          console.log('📡 Sending transaction to network...')
          
          try {
            const txHash = await client.sendTransaction(signedTransaction)
            console.log('✅ Transaction sent!')
            console.log('Transaction hash:', txHash.toHex())
            
            // Wait for transaction confirmation
            console.log('⏳ Waiting for confirmation...')
            await client.waitForTransactionConfirmation(txHash)
            console.log('🎉 Transaction confirmed!')
            
            // Check balances after transaction
            const senderBalance = await client.getBalance(wallet.address)
            const recipientBalance = await client.getBalance(recipientAddress)
            
            console.log('📊 Final balances:')
            console.log('  Sender:', Nimiq.Policy.lunasToCoins(senderBalance), 'NIM')
            console.log('  Recipient:', Nimiq.Policy.lunasToCoins(recipientBalance), 'NIM')
            
          } catch (error) {
            console.error('❌ Error sending transaction:', error.message)
          }
        }
        
        // Create a transaction with data field
        console.log('\n🔄 Creating transaction with data field...')
        
        const message = 'Hello from Nimiq tutorial!'
        const dataBytes = new TextEncoder().encode(message)
        
        // Create an extended transaction with data
        const extendedTransaction = new Nimiq.ExtendedTransaction(
          wallet.address,           // sender
          Nimiq.Account.Type.BASIC, // sender type
          recipientAddress,         // recipient
          Nimiq.Account.Type.BASIC, // recipient type
          Nimiq.Policy.coinsToLunas(0.5), // value (0.5 NIM)
          Nimiq.Policy.coinsToLunas(0.00001), // fee
          currentHeight + 10,       // validity start height (future block)
          Nimiq.Transaction.Flag.NONE, // flags
          dataBytes                 // data field
        )
        
        console.log('📝 Extended transaction created:')
        console.log('  Amount:', Nimiq.Policy.lunasToCoins(extendedTransaction.value), 'NIM')
        console.log('  Data:', message)
        console.log('  Data bytes:', dataBytes.length, 'bytes')
        
        // Sign the extended transaction
        const extSignature = Nimiq.Signature.create(
          wallet.keyPair.privateKey, 
          wallet.keyPair.publicKey, 
          extendedTransaction.serializeContent()
        )
        const signedExtTransaction = new Nimiq.SignedTransaction(extendedTransaction, extSignature)
        
        console.log('✅ Extended transaction signed!')
        
        // Verify and send
        const extIsValid = signedExtTransaction.verify()
        console.log('🔐 Extended signature valid:', extIsValid)
        
        if (extIsValid) {
          console.log('📡 Sending extended transaction to network...')
          
          try {
            const extTxHash = await client.sendTransaction(signedExtTransaction)
            console.log('✅ Extended transaction sent!')
            console.log('Transaction hash:', extTxHash.toHex())
            
            // Wait for confirmation
            console.log('⏳ Waiting for extended transaction confirmation...')
            await client.waitForTransactionConfirmation(extTxHash)
            console.log('🎉 Extended transaction confirmed!')
            
            // Get transaction details to verify data field
            const txDetails = await client.getTransaction(extTxHash)
            if (txDetails && txDetails.data) {
              const receivedMessage = new TextDecoder().decode(txDetails.data)
              console.log('📄 Data field content:', receivedMessage)
            }
            
          } catch (error) {
            console.error('❌ Error sending extended transaction:', error.message)
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
