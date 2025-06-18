import { Client, ClientConfiguration, KeyPair, Address, Policy, Transaction, TransactionReceipt } from '@nimiq/core'
import { Entropy } from '@nimiq/utils'

const FAUCET_URL = 'https://faucet.pos.nimiq-testnet.com/tapit'

async function requestFundsFromFaucet(address) {
  const response = await fetch(FAUCET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      address: address.toUserFriendlyAddress(),
      withStackingContract: false
    })
  })
  
  if (!response.ok) throw new Error(`Faucet request failed: ${response.status}`)
  console.log('✅ Faucet request successful!')
  return response.json()
}

async function main() {
  // Create client and connect to network
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
  config.syncMode('pico')
  config.logLevel('error')
  
  const client = await Client.create(config.build())
  await client.waitForConsensusEstablished()
  console.log('✅ Consensus established!')
  
  // Generate sender wallet
  const senderEntropy = Entropy.generate()
  const senderWallet = {
    keyPair: KeyPair.derive(senderEntropy),
    address: Address.derive(senderEntropy)
  }
  
  console.log('🎉 Sender wallet created!')
  console.log('📍 Sender Address:', senderWallet.address.toUserFriendlyAddress())
  
  // Request funds from faucet
  await requestFundsFromFaucet(senderWallet.address)
  await new Promise(resolve => setTimeout(resolve, 10000)) // Wait for funds
  
  const senderBalance = await client.getBalance(senderWallet.address)
  console.log('💰 Sender Balance:', Policy.lunasToCoins(senderBalance), 'NIM')
  
  if (senderBalance === 0) {
    console.log('⏳ No funds received yet. Faucet transaction might still be processing.')
    return
  }
  
  // Generate recipient wallet
  const recipientAddress = Address.derive(Entropy.generate())
  console.log('👤 Recipient address:', recipientAddress.toUserFriendlyAddress())
  
  // Create and sign transaction
  const transaction = new Transaction(
    senderWallet.address,           // sender
    recipientAddress,               // recipient  
    Policy.coinsToLunas(1),        // value (1 NIM)
    Policy.coinsToLunas(0.00001),  // fee (0.00001 NIM)
    client.headHash,               // validityStartHeight
    Transaction.Flag.NONE          // flags
  )
  
  const signature = senderWallet.keyPair.sign(transaction.serializeContent())
  const proof = TransactionReceipt.singleSig(senderWallet.keyPair.publicKey, signature)
  transaction.proof = proof.serialize()
  
  console.log('✍️ Transaction signed successfully!')
  
  // Send transaction
  console.log('📤 Sending transaction...')
  const txHash = await client.sendTransaction(transaction)
  console.log('✅ Transaction sent! Hash:', txHash.toHex())
  
  // Wait for confirmation
  const receipt = await client.waitForTransactionReceipt(txHash, 60000)
  if (receipt) {
    console.log('🎉 Transaction confirmed in block:', receipt.blockHeight)
    
    // Check final balances
    const newSenderBalance = await client.getBalance(senderWallet.address)
    const recipientBalance = await client.getBalance(recipientAddress)
    
    console.log('📊 Final balances:')
    console.log('  👤 Sender:', Policy.lunasToCoins(newSenderBalance), 'NIM')
    console.log('  🎯 Recipient:', Policy.lunasToCoins(recipientBalance), 'NIM')
  }
}

main().catch(console.error) 
