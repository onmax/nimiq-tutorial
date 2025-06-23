import {
  Address,
  Client,
  CryptoUtils,
  Hash,
  KeyPair,
  PrivateKey,
  Transaction,
  TransactionBuilder,
} from '@nimiq/core'

console.log('🚀 Starting Nimiq Cashlink Creator...')

// Connect to the Nimiq testnet
const client = new Client('wss://testnet.v2.nimiq-rpc.com')

// Generate a cashlink secret
function generateCashlinkSecret() {
  // Generate 32 random bytes and convert to base64
  const randomBytes = CryptoUtils.getRandomBytes(32)
  const secret = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  console.log('🔐 Generated Secret:', secret)
  return secret
}

// Create hash from secret
function createHashFromSecret(secret) {
  // Convert secret back to bytes
  const secretBytes = new TextEncoder().encode(secret)

  // Create SHA-256 hash
  const hash = Hash.sha256(secretBytes)

  console.log('🔗 Hash Root:', hash.toHex())
  return hash
}

// Create HTLC transaction
async function createHTLCTransaction(senderKeyPair, recipientAddress, amount, hashRoot, timeout) {
  console.log('📝 Creating HTLC Transaction...')

  const senderAddress = senderKeyPair.toAddress()

  // Create HTLC data
  const htlcData = {
    sender: senderAddress.toUserFriendlyAddress(),
    recipient: recipientAddress,
    hashRoot: hashRoot.toHex(),
    hashAlgorithm: 'sha256',
    hashCount: 1,
    timeout,
  }

  console.log('🏗️ HTLC Data:', htlcData)

  // Build the transaction
  const transaction = new TransactionBuilder()
    .sender(senderAddress)
    .recipient(Address.fromUserFriendlyAddress(recipientAddress))
    .value(amount)
    .flag(Transaction.Flag.CREATE_HTLC)
    .data(htlcData)
    .build()

  // Sign the transaction
  senderKeyPair.signTransaction(transaction)

  console.log('✅ HTLC Transaction Created!')
  console.log('├─ From:', senderAddress.toUserFriendlyAddress())
  console.log('├─ To HTLC:', transaction.recipient.toUserFriendlyAddress())
  console.log('├─ Amount:', amount / 1e5, 'NIM')
  console.log('└─ Timeout:', timeout)

  return transaction
}

// Build cashlink URL
function buildCashlinkURL(htlcAddress, secret, message = '', theme = '') {
  const baseURL = 'https://hub.nimiq.com/cashlink/#'

  let url = baseURL + htlcAddress

  // Add secret parameter
  if (secret) {
    url += `&s=${encodeURIComponent(secret)}`
  }

  // Add optional message
  if (message) {
    url += `&m=${encodeURIComponent(message)}`
  }

  // Add optional theme
  if (theme) {
    url += `&t=${encodeURIComponent(theme)}`
  }

  console.log('🔗 Cashlink URL:', url)
  return url
}

// Create complete cashlink
async function createCashlink(senderKeyPair, amount, message = 'Enjoy your NIM!', timeoutBlocks = 1000) {
  console.log('🚀 Creating Cashlink...\n')

  try {
    // Step 1: Generate secret
    const secret = generateCashlinkSecret()

    // Step 2: Create hash from secret
    const hashRoot = createHashFromSecret(secret)

    // Step 3: Calculate timeout
    const head = await client.getHeadBlock()
    const timeout = head.height + timeoutBlocks

    // Step 4: Use sender as recipient (typical for cashlinks)
    const recipientAddress = senderKeyPair.toAddress().toUserFriendlyAddress()

    // Step 5: Create HTLC transaction
    const transaction = await createHTLCTransaction(
      senderKeyPair,
      recipientAddress,
      amount,
      hashRoot,
      timeout,
    )

    // Step 6: Build cashlink URL
    const cashlinkURL = buildCashlinkURL(
      transaction.recipient.toUserFriendlyAddress(),
      secret,
      message,
      'nimiq',
    )

    console.log('\n✅ Cashlink Created Successfully!')
    console.log('📋 Cashlink Details:')
    console.log('├─ Amount:', amount / 1e5, 'NIM')
    console.log('├─ Message:', message)
    console.log('├─ Expires at block:', timeout)
    console.log('├─ Secret:', secret)
    console.log('└─ URL:', cashlinkURL)

    return {
      transaction,
      secret,
      url: cashlinkURL,
      htlcAddress: transaction.recipient.toUserFriendlyAddress(),
    }
  }
  catch (error) {
    console.error('❌ Error creating cashlink:', error.message)
    throw error
  }
}

// Claim cashlink function
async function claimCashlink(cashlinkURL, claimerKeyPair) {
  console.log('💰 Attempting to claim cashlink...')

  try {
    // Parse the URL to extract parameters
    const url = new URL(cashlinkURL)
    const hash = url.hash.substring(1) // Remove the #
    const params = new URLSearchParams(hash.split('&').slice(1).join('&'))

    const htlcAddress = hash.split('&')[0]
    const secret = params.get('s')
    const message = params.get('m')

    console.log('📋 Cashlink Info:')
    console.log('├─ HTLC Address:', htlcAddress)
    console.log('├─ Message:', message || 'No message')
    console.log('└─ Secret:', secret ? 'Found' : 'Missing')

    if (!secret) {
      throw new Error('No secret found in cashlink URL')
    }

    // Get HTLC account info
    const htlcAccount = await client.getAccount(htlcAddress)

    if (htlcAccount.type !== 'htlc') {
      throw new Error('Address is not an HTLC contract')
    }

    console.log('🎯 Found HTLC Contract:')
    console.log('├─ Balance:', htlcAccount.balance / 1e5, 'NIM')
    console.log('├─ Timeout:', htlcAccount.timeout)
    console.log('└─ Hash Root:', htlcAccount.hashRoot)

    // Verify secret matches hash
    const secretBytes = new TextEncoder().encode(secret)
    const computedHash = Hash.sha256(secretBytes)

    if (computedHash.toHex() === htlcAccount.hashRoot) {
      console.log('✅ Secret verified! Hash matches.')

      // Create claim transaction
      const claimTransaction = new TransactionBuilder()
        .sender(Address.fromUserFriendlyAddress(htlcAddress))
        .recipient(claimerKeyPair.toAddress())
        .value(htlcAccount.balance)
        .flag(Transaction.Flag.RESOLVE_HTLC)
        .data({ secret })
        .build()

      console.log('📝 Claim transaction prepared')
      console.log('├─ From HTLC:', htlcAddress)
      console.log('├─ To:', claimerKeyPair.toAddress().toUserFriendlyAddress())
      console.log('└─ Amount:', htlcAccount.balance / 1e5, 'NIM')

      return {
        htlcAccount,
        secret,
        message,
        claimTransaction,
      }
    }
    else {
      console.log('❌ Secret verification failed!')
      console.log('├─ Expected hash:', htlcAccount.hashRoot)
      console.log('└─ Computed hash:', computedHash.toHex())
    }
  }
  catch (error) {
    console.error('❌ Error claiming cashlink:', error.message)
    throw error
  }
}

// Test cashlink flow
async function testCashlinkFlow() {
  console.log('🧪 Testing Cashlink Flow...\n')

  // Generate a test wallet
  const senderPrivateKey = PrivateKey.generate()
  const senderKeyPair = KeyPair.derive(senderPrivateKey)

  console.log('👤 Sender Address:', senderKeyPair.toAddress().toUserFriendlyAddress())
  console.log('💰 Creating 1 NIM cashlink...\n')

  try {
    // Create a cashlink for 1 NIM
    const cashlink = await createCashlink(
      senderKeyPair,
      1e5, // 1 NIM in lunas
      'Welcome to Nimiq!',
      1000, // 1000 blocks timeout
    )

    console.log('\n🔗 Your cashlink is ready!')
    console.log('Share this URL:', cashlink.url)

    // Simulate claiming (without actually sending transactions)
    console.log('\n🎭 Simulating claim...')

    // Generate claimer wallet
    const claimerPrivateKey = PrivateKey.generate()
    const claimerKeyPair = KeyPair.derive(claimerPrivateKey)
    console.log('👤 Claimer Address:', claimerKeyPair.toAddress().toUserFriendlyAddress())

    // For demo purposes, we'll create a mock HTLC account
    const mockHTLCAccount = {
      type: 'htlc',
      balance: 1e5,
      timeout: 12345,
      hashRoot: Hash.sha256(new TextEncoder().encode(cashlink.secret)).toHex(),
      sender: senderKeyPair.toAddress().toUserFriendlyAddress(),
      recipient: senderKeyPair.toAddress().toUserFriendlyAddress(),
    }

    // Mock the client.getAccount call for demo
    const originalGetAccount = client.getAccount
    client.getAccount = async (address) => {
      if (address === cashlink.htlcAddress) {
        return mockHTLCAccount
      }
      return originalGetAccount.call(client, address)
    }

    await claimCashlink(cashlink.url, claimerKeyPair)

    // Restore original method
    client.getAccount = originalGetAccount
  }
  catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

client.addConsensusChangedListener((state) => {
  console.log(`📡 Consensus state: ${state}`)

  if (state === 'established') {
    console.log('✅ Connected to Nimiq testnet!')
    console.log('🔗 Ready to create cashlinks...\n')

    // Execute the cashlink flow test
    testCashlinkFlow()
  }
})

// Handle errors
client.addErrorListener((error) => {
  console.error('❌ Connection error:', error)
})
