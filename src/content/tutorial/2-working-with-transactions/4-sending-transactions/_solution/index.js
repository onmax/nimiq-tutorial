import { Client, ClientConfiguration, KeyPair, Address, Policy, Transaction, TransactionReceipt } from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

console.log('Starting Nimiq client...')

// This is the Testnet Faucet URL
const FAUCET_URL = 'https://faucet.pos.nimiq-testnet.com/tapit'

async function requestFundsFromFaucet(address) {
  try {
    const response = await fetch(FAUCET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        address: address.toUserFriendlyAddress(),
        withStackingContract: false
      })
    })

    if (!response.ok) {
      throw new Error(`Faucet request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('💰 Faucet request successful!')
    return data
  } catch (error) {
    console.error('❌ Faucet request failed:', error.message)
    throw error
  }
}

async function main() {
  try {
      // Create client configuration
  const config = new ClientConfiguration()
  // We can also use `MainAlbatross` for mainnet
  config.network('TestAlbatross')

  // We must explicitly set the seed nodes for testnet
  config.seedNodes([
    '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
    '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
  ])
    
    // Connect using pico which is faster
    // Read more at: https://www.nimiq.com/developers/learn/protocol/sync-protocol/nodes-and-sync
    config.syncMode('pico')
    
    // Print minimal messages
    config.logLevel('error')
    
    // Create the client instance
    const client = await Client.create(config.build())
    console.log('Client created, waiting for consensus...')
    
    // Wait for consensus
    await client.waitForConsensusEstablished()
    console.log('✅ Consensus established!')
    
    // Generate sender wallet
    const senderEntropy = Entropy.generate()
    const senderWallet = {
      keyPair: KeyPair.derive(senderEntropy),
      address: Address.derive(senderEntropy)
    }
    
    console.log('🎉 Sender wallet created!')
    console.log('Sender Address:', senderWallet.address.toUserFriendlyAddress())
    
    // Request funds from faucet for sender
    console.log('💧 Requesting funds from faucet...')
    await requestFundsFromFaucet(senderWallet.address)
    
    // Wait for funds to arrive
    await new Promise(resolve => setTimeout(resolve, 10000))
    
    // Check sender balance
    let senderBalance = await client.getBalance(senderWallet.address)
    console.log('Sender Balance:', Policy.lunasToCoins(senderBalance), 'NIM')
    
    if (senderBalance === 0) {
      console.log('⏳ No funds received yet. Faucet transaction might still be processing.')
      return
    }
    
    // Generate recipient wallet
    const recipientEntropy = Entropy.generate()
    const recipientAddress = Address.derive(recipientEntropy)
    
    console.log('👤 Recipient address:', recipientAddress.toUserFriendlyAddress())
    
    // Create a transaction
    const transaction = new Transaction(
      senderWallet.address,           // sender
      recipientAddress,               // recipient  
      Policy.coinsToLunas(1),        // value (1 NIM)
      Policy.coinsToLunas(0.00001),  // fee (0.00001 NIM)
      client.headHash,               // validityStartHeight
      Transaction.Flag.NONE          // flags
    )
    
    console.log('📄 Transaction created:')
    console.log('  From:', transaction.sender.toUserFriendlyAddress())
    console.log('  To:', transaction.recipient.toUserFriendlyAddress())
    console.log('  Amount:', Policy.lunasToCoins(transaction.value), 'NIM')
    console.log('  Fee:', Policy.lunasToCoins(transaction.fee), 'NIM')
    console.log('  Hash:', transaction.hash.toHex())
    
    // Sign the transaction
    const signature = senderWallet.keyPair.sign(transaction.serializeContent())
    const proof = TransactionReceipt.singleSig(senderWallet.keyPair.publicKey, signature)
    transaction.proof = proof.serialize()
    
    console.log('✍️ Transaction signed successfully!')
    console.log('Signature:', signature.toHex())
    
    // Send the transaction
    console.log('📤 Sending transaction...')
    const txHash = await client.sendTransaction(transaction)
    console.log('✅ Transaction sent! Hash:', txHash.toHex())
    
    // Wait for confirmation
    console.log('⏳ Waiting for transaction confirmation...')
    const receipt = await client.waitForTransactionReceipt(txHash, 60000) // 60 seconds timeout
    
    if (receipt) {
      console.log('🎉 Transaction confirmed!')
      console.log('Block height:', receipt.blockHeight)
      console.log('Block hash:', receipt.blockHash.toHex())
      
      // Check balances after transaction
      const newSenderBalance = await client.getBalance(senderWallet.address)
      const recipientBalance = await client.getBalance(recipientAddress)
      
      console.log('📊 Final balances:')
      console.log('  Sender:', Policy.lunasToCoins(newSenderBalance), 'NIM')
      console.log('  Recipient:', Policy.lunasToCoins(recipientBalance), 'NIM')
    } else {
      console.log('⏰ Transaction confirmation timeout')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
