import { KeyPair, Address, TransactionBuilder, PrivateKey } from '@nimiq/core'
import { setupConsensus } from './consensus.js'
// import { requestFromFaucet } from './faucet.js'

console.log('🚀 Starting Nimiq client...')

async function main() {
  try {
    // Setup consensus (from previous lessons)
    const client = await setupConsensus()

    // Generate a new wallet 🔐

    // TODO: At the moment we cannot use the faucet, so we need to use a private key that has funds
    const privateKey = PrivateKey.fromHex('204aec9a093c8eb99d5136f9aa0910dd131934287035d03c7b9d5b2a6db042e3')

    // const privateKey = PrivateKey.generate()
    const keyPair = KeyPair.derive(privateKey)
    const address = keyPair.toAddress()

    console.log('🎉 Wallet created!')
    console.log('📍 Address:', address.toUserFriendlyAddress())

    // TODO: Uncomment this when the faucet is working again
    // Get funds from faucet (from previous lessons)
    // await requestFromFaucet(client, address)

    // Read the current balance of our account
    const account = await client.getAccount(address.toUserFriendlyAddress());
    console.log('💰 Current balance:', account.balance / 1e5, 'NIM')

    // Get transaction history to find the sender of the first transaction (faucet)
    const txHistory = await client.getTransactionsByAddress(address)
    console.log(`📊 Found ${txHistory.length} transactions`)

    if (txHistory.length === 0) {
      console.log('❌ No transactions found in history')
      return
    }

    // We need to find the most recent transaction that is not from us
    const firstTx = txHistory.find(tx => tx.sender !== address.toUserFriendlyAddress())
    const faucetAddress = Address.fromUserFriendlyAddress(firstTx.sender)
    console.log('🔍 Faucet address found:', faucetAddress.toUserFriendlyAddress())

    // Get current block height
    const headBlock = await client.getHeadBlock()
    console.log('📊 Current block height:', headBlock.height)

    // Get network ID
    const networkId = await client.getNetworkId()
    console.log('🌐 Network ID:', networkId)

    // Calculate amounts for each transaction (half each)
    const halfAmount = account.balance / 2
    console.log('💸 Sending amount per transaction:', account.balance / 2 / 1e5, 'NIM')

    // Create a basic transaction sending half of the funds back to the faucet sender
    const basicTx = TransactionBuilder.newBasic(
      address,           // sender
      faucetAddress,     // recipient (faucet)
      BigInt(halfAmount),        // value (half of balance)
      0n,                // fee (0 in Nimiq!)
      headBlock.height,     // validity start height
      networkId          // network ID
    )

    console.log('📝 Basic transaction created:')
    console.log('  From:', basicTx.sender.toUserFriendlyAddress())
    console.log('  To:', basicTx.recipient.toUserFriendlyAddress())
    console.log('  Amount:', Number(basicTx.value) / 1e5, 'NIM')
    console.log('  Type: Basic')

    // Sign the basic transaction
    basicTx.sign(keyPair)

    console.log('✍️ Basic Transaction signed successfully!')

    // Send the basic transaction
    console.log('📤 Sending basic transaction...')
    const basicTxHash = await client.sendTransaction(basicTx)
    console.log('✅ Basic transaction sent! Hash:', basicTxHash.serializedTx)

    // Create an extended transaction with data sending the other half back
    const message = "Nimiq is awesome!"
    const messageBytes = new TextEncoder().encode(message)

    const extendedTx = TransactionBuilder.newBasicWithData(
      address,           // sender
      faucetAddress,     // recipient (faucet)
      messageBytes,      // data
      BigInt(halfAmount),        // value (remaining half)
      0n,                // fee (0 in Nimiq!)
      headBlock.height, // validity start height
      networkId          // network ID
    )

    console.log('📝 Extended transaction created:')
    console.log('  From:', extendedTx.sender.toUserFriendlyAddress())
    console.log('  To:', extendedTx.recipient.toUserFriendlyAddress())
    console.log('  Amount:', Number(extendedTx.value) / 1e5, 'NIM')
    console.log('  Message:', message)
    console.log('  Type: Extended with Data')

    // Sign both transactions
    extendedTx.sign(keyPair)
    console.log('✍️ Extended Transaction signed successfully!')

    // Send the extended transaction
    console.log('📤 Sending extended transaction...')
    const extendedTxHash = await client.sendTransaction(extendedTx)
    console.log('✅ Extended transaction sent! Hash:', extendedTxHash.serializedTx)

    console.log('🎉 All transactions sent successfully!')
    console.log('')
    console.log('📋 Summary:')
    console.log(`  • Basic transaction: ${halfAmount / 1e5} NIM`)
    console.log(`  • Extended transaction: ${halfAmount / 1e5} NIM with message "${message}"`)
    console.log(`  • Total sent: ${account.balance / 1e5} NIM`)
    console.log('  • Both transactions are now being processed by the network!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main() 
