---
type: lesson
title: Creating Your First Cashlink
focus: /index.js
terminal:
  panels: ['output']
---

# Creating Your First Cashlink 🔗

Now that you understand HTLCs, let's create your first cashlink! A cashlink is essentially an HTLC wrapped in a shareable URL that contains all the information needed to claim the funds.

## What You'll Build

In this lesson, you'll create:

✅ **Secret generator** - Secure random secrets for cashlinks
✅ **HTLC transaction builder** - Smart contracts that hold the funds
✅ **Cashlink URL creator** - Shareable links with embedded secrets
✅ **Claim functionality** - Code to redeem cashlinks

## What Makes a Cashlink?

A cashlink consists of four key components:

1. **Secret** 🔐 - A random string that unlocks the funds
2. **HTLC Transaction** 📝 - Creates the contract on the blockchain
3. **Cashlink URL** 🔗 - Contains the secret and contract address
4. **Timeout** ⏰ - When the funds return to sender if unclaimed

## Cashlink URL Structure

A typical cashlink URL looks like this:

```
https://hub.nimiq.com/cashlink/#NQ123...456&s=SECRET_STRING&m=MESSAGE&t=THEME
```

Where:

- `NQ123...456` is the HTLC contract address
- `s=SECRET_STRING` is the secret to claim the funds
- `m=MESSAGE` is an optional message
- `t=THEME` is an optional theme for the UI

## Building Your Cashlink Creator

We'll create a cashlink generator that handles the complete flow from creation to claiming.

## Step 1: Import Required Classes 📦

We need additional classes for creating transactions and handling secrets:

```js
import {
  Client,
  CryptoUtils,
  Hash,
  KeyPair,
  PrivateKey,
  Transaction,
  TransactionBuilder
} from '@nimiq/core'
```

## Step 2: Generate a Cashlink Secret 🔐

Create a function to generate a secure random secret:

```js
function generateCashlinkSecret() {
  // Generate 32 random bytes and convert to base64
  const randomBytes = CryptoUtils.getRandomBytes(32)
  const secret = btoa(String.fromCharCode(...randomBytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')

  console.log('Generated Secret:', secret)
  return secret
}
```

## Step 3: Create Hash from Secret 🔒

Convert the secret into a hash that will be stored in the HTLC:

```js
function createHashFromSecret(secret) {
  // Convert secret back to bytes
  const secretBytes = new TextEncoder().encode(secret)

  // Create SHA-256 hash
  const hash = Hash.sha256(secretBytes)

  console.log('Hash Root:', hash.toHex())
  return hash
}
```

## Step 4: Create HTLC Transaction 📝

Build the transaction that creates the HTLC contract:

```js
async function createHTLCTransaction(senderKeyPair, recipientAddress, amount, hashRoot, timeout) {
  console.log('Creating HTLC Transaction...')

  const senderAddress = senderKeyPair.toAddress()

  // Create HTLC data
  const htlcData = {
    sender: senderAddress.toUserFriendlyAddress(),
    recipient: recipientAddress,
    hashRoot: hashRoot.toHex(),
    hashAlgorithm: 'sha256',
    hashCount: 1,
    timeout
  }

  console.log('HTLC Data:', htlcData)

  // Build the transaction
  const transaction = new TransactionBuilder()
    .sender(senderAddress)
    .recipient(recipientAddress) // This will be the HTLC contract address
    .value(amount)
    .flag(Transaction.Flag.CREATE_HTLC)
    .data(htlcData)
    .build()

  // Sign the transaction
  senderKeyPair.signTransaction(transaction)

  console.log('HTLC Transaction Created!')
  console.log('├─ From:', senderAddress.toUserFriendlyAddress())
  console.log('├─ To HTLC:', transaction.recipient.toUserFriendlyAddress())
  console.log('├─ Amount:', amount / 1e5, 'NIM')
  console.log('└─ Timeout:', timeout)

  return transaction
}
```

## Step 5: Build Cashlink URL 🔗

Create the shareable cashlink URL:

```js
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

  console.log('Cashlink URL:', url)
  return url
}
```

## Step 6: Create Complete Cashlink 🎯

Put it all together in a main function:

```js
async function createCashlink(senderKeyPair, amount, message = 'Enjoy your NIM!', timeoutBlocks = 1000) {
  console.log('Creating Cashlink...\n')

  try {
    // Step 1: Generate secret
    const secret = generateCashlinkSecret()

    // Step 2: Create hash from secret
    const hashRoot = createHashFromSecret(secret)

    // Step 3: Calculate timeout
    const head = await client.getHeadBlock()
    const timeout = head.height + timeoutBlocks

    // Step 4: Create recipient address (this would be calculated properly)
    const recipientAddress = 'NQ07 0000 0000 0000 0000 0000 0000 0000 0000'

    // Step 5: Create HTLC transaction
    const transaction = await createHTLCTransaction(
      senderKeyPair,
      recipientAddress,
      amount,
      hashRoot,
      timeout
    )

    // Step 6: Build cashlink URL
    const cashlinkURL = buildCashlinkURL(
      transaction.recipient.toUserFriendlyAddress(),
      secret,
      message,
      'nimiq'
    )

    console.log('\nCashlink Created Successfully!')
    console.log('Cashlink Details:')
    console.log('├─ Amount:', amount / 1e5, 'NIM')
    console.log('├─ Message:', message)
    console.log('├─ Expires at block:', timeout)
    console.log('├─ Secret:', secret)
    console.log('└─ URL:', cashlinkURL)

    return {
      transaction,
      secret,
      url: cashlinkURL,
      htlcAddress: transaction.recipient.toUserFriendlyAddress()
    }
  }
  catch (error) {
    console.error('Error creating cashlink:', error.message)
    throw error
  }
}
```

## Step 7: Claim Cashlink Function

Create a function to claim an existing cashlink:

```js
async function claimCashlink(cashlinkURL, claimerKeyPair) {
  console.log('Attempting to claim cashlink...')

  try {
    // Parse the URL to extract parameters
    const url = new URL(cashlinkURL)
    const hash = url.hash.substring(1) // Remove the #
    const params = new URLSearchParams(hash.split('&').slice(1).join('&'))

    const htlcAddress = hash.split('&')[0]
    const secret = params.get('s')
    const message = params.get('m')

    console.log('Cashlink Info:')
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

    console.log('Found HTLC Contract:')
    console.log('├─ Balance:', htlcAccount.balance / 1e5, 'NIM')
    console.log('├─ Timeout:', htlcAccount.timeout)
    console.log('└─ Hash Root:', htlcAccount.hashRoot)

    // Note: Creating claim transaction requires proper HTLC proof creation
    console.log('Claim transaction creation would go here')
    console.log('(This requires creating proper HTLC proofs with the preimage)')

    return {
      htlcAccount,
      secret,
      message
    }
  }
  catch (error) {
    console.error('Error claiming cashlink:', error.message)
    throw error
  }
}
```

## Step 8: Test Your Cashlink

Add a test function to demonstrate the complete flow:

```js
async function testCashlinkFlow() {
  console.log('Testing Cashlink Flow...\n')

  // Generate a test wallet
  const senderPrivateKey = PrivateKey.generate()
  const senderKeyPair = KeyPair.derive(senderPrivateKey)

  console.log('Sender Address:', senderKeyPair.toAddress().toUserFriendlyAddress())
  console.log('Creating 1 NIM cashlink...\n')

  try {
    // Create a cashlink for 1 NIM
    const cashlink = await createCashlink(
      senderKeyPair,
      1e5, // 1 NIM in lunas
      'Welcome to Nimiq!',
      1000 // 1000 blocks timeout
    )

    console.log('\nYour cashlink is ready!')
    console.log('Share this URL:', cashlink.url)

    // Simulate claiming (without actually sending transactions)
    console.log('\nSimulating claim...')
    await claimCashlink(cashlink.url, senderKeyPair)
  }
  catch (error) {
    console.error('Test failed:', error.message)
  }
}

// Execute the test
testCashlinkFlow()
```

## Key Concepts

You've learned how to:

- **Generate secrets** - Create secure random strings for cashlinks
- **Hash preimages** - Convert secrets to hashes for HTLC storage
- **Build transactions** - Construct HTLC creation transactions
- **Encode URLs** - Build shareable cashlink URLs with parameters
- **Parse cashlinks** - Extract information from cashlink URLs

## Security Considerations

When working with cashlinks, remember:

#### Secret Management 🔒

- Always use cryptographically secure random secrets
- Never reuse secrets across different cashlinks
- Store secrets securely until claimed

#### URL Sharing 📤

- Anyone with the URL can claim the funds
- Share cashlinks through secure channels when possible
- Consider shorter expiration times for sensitive amounts

#### Timeout Management ⏰

- Set appropriate expiration times based on use case
- Account for network congestion when setting timeouts
- Remember that expired funds return to the sender

## Next Steps

In the next lesson, we'll build a complete cashlink generator with a user interface that handles:

- Proper HTLC address calculation
- Real transaction broadcasting
- Claim transaction creation
- Error handling and validation

Understanding these concepts prepares you for building production cashlink applications!
