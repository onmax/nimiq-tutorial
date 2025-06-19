/**
 * Nimiq Staking Tutorial - Creating a Delegation
 * 
 * This lesson demonstrates how to create a staking delegation transaction.
 */

import { createAndConnectClient } from './lib/consensus.js'
import { createWallet, getWallet } from './lib/wallet.js'
import { getTestnetNIM } from './lib/faucet.js'
import { getActiveValidators, createDelegationTransaction, sendTransaction } from './lib/staking.js'

async function main() {
  console.log('🚀 Welcome to the Staking Delegation Creator!')
  
  // TODO: Connect to the network
  
  // TODO: Create or load wallet
  
  // TODO: Request testnet NIM
  
  // TODO: Query validators
  
  // TODO: Create and send delegation transaction
  
  console.log('✅ Delegation transaction created and sent!')
}

main().catch(console.error) 
