import { createAndConnectClient } from './lib/consensus.js'
import { createRandomWallet } from './lib/wallet.js'
import { requestFundsFromFaucet, waitForFunds } from './lib/faucet.js'
import { Policy, StakingContract, Transaction, TransactionReceipt } from '@nimiq/core'

async function main() {
  console.log('🚀 Starting Nimiq Staking Tutorial')
  // Create client and connect to network
  const client = await createAndConnectClient()

  // Create a wallet
  const wallet = createRandomWallet()
  console.log('\n🎉 Wallet created:')
  console.log('📍 Address:', wallet.address.toUserFriendlyAddress())

  // Request funds from faucet
  console.log('\n💧 Requesting testnet funds...')
  await requestFundsFromFaucet(wallet.address)
  await waitForFunds(client, wallet.address)

  const balance = await client.getBalance(wallet.address)
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
    wallet.address,
    selectedValidator.address,
    delegationAmount,
    Policy.coinsToLunas(0.00001),
    client.headHash,
    Transaction.Flag.NONE,
    data
  )
  // Sign transaction
  const signature = wallet.keyPair.sign(transaction.serializeContent())
  const proof = TransactionReceipt.singleSig(wallet.keyPair.publicKey, signature)
  transaction.proof = proof.serialize()

  console.log('\n📤 Sending delegation transaction...')
  const txHash = await client.sendTransaction(transaction)
  console.log('🔗 Transaction hash:', txHash.toHex())

  // Wait for confirmation
  console.log('⏳ Waiting for confirmation...')
  const receipt = await client.waitForTransactionReceipt(txHash, 60000)
  if (receipt) {
    console.log('✅ Delegation successful!')
    console.log('📈 Block height:', receipt.blockHeight)
    const newBalance = await client.getBalance(wallet.address)
    console.log('💰 Remaining balance:', Policy.lunasToCoins(newBalance), 'NIM')
    console.log('\n🎉 Congratulations! You have successfully delegated NIM to a validator!')
    console.log('📈 Your delegation will start earning rewards in the next epoch.')
  } else {
    console.log('❌ Transaction failed or timed out')
  }
}

main().catch(console.error) 
