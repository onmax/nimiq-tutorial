import { Client, ClientConfiguration, KeyPair, Address, Policy, StakingContract, Transaction, TransactionReceipt } from '@nimiq/core'
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
  console.log('Faucet request successful!')
  return response.json()
}

async function main() {
  console.log('🚀 Starting Nimiq Staking Tutorial')
  
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
  console.log('✅ Connected to Nimiq testnet!')
  
  // Create a wallet
  const entropy = Entropy.generate()
  const keyPair = KeyPair.derive(entropy)
  const address = Address.derive(entropy)
  
  console.log('\n🎉 Wallet created:')
  console.log('📍 Address:', address.toUserFriendlyAddress())
  
  // Request funds from faucet
  console.log('\n💧 Requesting testnet funds...')
  await requestFundsFromFaucet(address)
  
  // Wait for funds to arrive
  console.log('⏳ Waiting for funds...')
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  const balance = await client.getBalance(address)
  console.log('💰 Balance:', Policy.lunasToCoins(balance), 'NIM')
  
  if (balance === 0) {
    console.log('⏳ No funds received yet. Faucet transaction might still be processing.')
    return
  }
  
  // Get validators
  console.log('\n🏛️ Fetching active validators...')
  const validators = await client.getActiveValidators()
  
  if (validators.length === 0) {
    console.log('❌ No active validators found')
    return
  }
  
  const selectedValidator = validators[0]
  console.log(`🎯 Selected validator: ${selectedValidator.address.toUserFriendlyAddress()}`)
  console.log(`💰 Validator balance: ${Policy.lunasToCoins(selectedValidator.balance)} NIM`)
  
  // Calculate delegation amount (stake 50% of balance)
  const delegationAmount = Math.floor(balance * 0.5)
  console.log(`\n📝 Delegating ${Policy.lunasToCoins(delegationAmount)} NIM to validator`)
  
  // Create delegation transaction
  const stakingContract = new StakingContract()
  const data = stakingContract.createIncomingData(selectedValidator.address, delegationAmount)
  
  const transaction = new Transaction(
    address,                          // sender
    Address.fromString('NQ07 0000 0000 0000 0000 0000 0000 0000 0001'), // staking contract
    delegationAmount,                 // value
    Policy.coinsToLunas(0.00001),    // fee
    client.headHash,                 // validity start height
    Transaction.Flag.NONE,           // flags
    data                             // contract data
  )
  
  // Sign transaction
  const signature = keyPair.sign(transaction.serializeContent())
  const proof = TransactionReceipt.singleSig(keyPair.publicKey, signature)
  transaction.proof = proof.serialize()
  
  console.log('\n📤 Sending delegation transaction...')
  const txHash = await client.sendTransaction(transaction)
  console.log('🔗 Transaction hash:', txHash.toHex())
  
  // Wait for confirmation
  console.log('⏳ Waiting for confirmation...')
  const receipt = await client.waitForTransactionReceipt(txHash, 60000)
  
  if (receipt) {
    console.log('✅ Delegation successful!')
    console.log('📊 Block height:', receipt.blockHeight)
    
    const newBalance = await client.getBalance(address)
    console.log('💰 Remaining balance:', Policy.lunasToCoins(newBalance), 'NIM')
    
    console.log('\n🎉 Congratulations! You have successfully delegated NIM to a validator!')
    console.log('📈 Your delegation will start earning rewards in the next epoch.')
  } else {
    console.log('❌ Transaction failed or timed out')
  }
}

main().catch(console.error) 
