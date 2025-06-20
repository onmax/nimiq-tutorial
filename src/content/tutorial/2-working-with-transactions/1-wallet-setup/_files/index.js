import { KeyPair, Policy, PrivateKey } from '@nimiq/core'
import { getClient } from './consensus.js'


async function main() {
  console.log('🚀 Starting Nimiq client...')

  // Setup consensus (moved to separate file for clarity)
  const client = await getClient()

  // TODO: Generate a new wallet using PrivateKey.generate()
  // const privateKey = 

  // TODO: Create a KeyPair from the private key using KeyPair.derive()
  // const keyPair = 

  // TODO: Display the wallet information with success message
  console.log('🎉 Wallet created successfully!')

  // TODO: Get the address from the keyPair using keyPair.toAddress()
  // const address = 

  // TODO: Log the user-friendly address and public key
  // console.log('Address:', ...)
  // console.log('Public Key:', ...)

  // TODO: Check wallet balance using client.getAccount()
  // const account = 

  // TODO: Convert balance from lunas to NIM (divide by 1e5) and display
  // const nim = 
  // console.log(`Balance: ${nim} NIM`)
}

main() 
