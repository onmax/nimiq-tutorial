import { KeyPair, PrivateKey } from '@nimiq/core'
import { getClient } from './consensus.js'
// import { requestFromFaucet } from './faucet.js'

console.log('🚀 Starting Nimiq client...')

async function main() {
  try {
    // Setup consensus
    const client = await getClient()
    
    // Generate a new wallet 🔐
    const privateKey = PrivateKey.generate()
    
    const keyPair = KeyPair.derive(privateKey)
      
    // Display the wallet information 
    console.log('🎉 Wallet created successfully!')
    
    const address = keyPair.toAddress()
    console.log('📍 Address:', address.toUserFriendlyAddress())
    console.log('🔐 Public Key:', keyPair.publicKey.toHex())

    // Check wallet balance 💰
    const account = await client.getAccount(address.toUserFriendlyAddress());  
    console.log('📊 Account:', account)  
    
    // Convert lunas to NIM. In this case, the balance is always 0 since we just created the wallet.
    const nim = account.balance / 1e5
    console.log(`💰 Initial Balance: ${nim} NIM`)
    
    // TODO: Request funds from faucet
    
    // TODO: Check balance again
    
  } catch (error) {
    console.error('Error:', error)
  }
}

main() 
