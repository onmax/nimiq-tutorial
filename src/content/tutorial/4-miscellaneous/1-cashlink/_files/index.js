import { AccountType, Address, Transaction, BufferUtils, KeyPair, SerialBuffer, TransactionFlag } from '@nimiq/core'
import { Utf8Tools } from '@nimiq/utils/utf8-tools'

import { getFundedWallet } from './lib/wallet.js'
import { setupConsensus } from './lib/consensus.js'


function getCashlinkUrl(network, cashlinkKeyPair, amount, message) {
  // TODO: Implement this
}

const CashlinkExtraData = {
  // TODO: Implement this
}

async function fundCashlink(client, keyPair, cashlinkAddress, amount) {
  // TODO: Implement this
}

/**
 * Sets up transaction listeners for cashlink funding and claiming
 */
async function setupCashlinkListeners(client, cashlinkAddress, senderAddress) {
  // TODO: Implement this
}

async function main() {
  try {
    const network = 'TestAlbatross'
    const client = await setupConsensus(network)

    const keyPair = await getFundedWallet(client)
    const senderAddress = keyPair.toAddress()

    const amount = 1e5 // 1 NIM in Luna
    const message = 'Enjoy your NIM!'
    const hubDomain = network === 'MainAlbatross' ? 'https://hub.nimiq.com' : 'https://hub.nimiq-testnet.com'

    // TODO Generate a new keypair for the cashlink

    // TODO Generate the cashlink URL

    // TODO Set up transaction listeners

    // TODO Fund the cashlink

    // TODO Print the cashlink URL
  }
  catch (error) {
    console.error('❌ Error:', error.message)
  }
}

main()
