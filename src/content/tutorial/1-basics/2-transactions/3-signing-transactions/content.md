---
type: lesson
title: Creating and Signing Transactions
focus: /index.js
terminal:
  panels: ['output']
---

# Creating and Signing Transactions

Now that we have a funded wallet, let's learn how to create, sign, and send transactions. This is the core functionality for transferring NIM between addresses.

## Understanding Transactions

- A **transaction** represents a transfer of value from one address to another
- **Signing** a transaction proves that you own the private key associated with the sender address
- **Fees** are required to incentivize miners to include your transaction in a block
- Transactions must be signed before they can be sent to the network

## Transaction Components

Every transaction has these key components:
- **Sender**: The address sending the funds (your wallet)
- **Recipient**: The address receiving the funds
- **Value**: The amount to send (in Luna, the smallest unit)
- **Fee**: The transaction fee (in Luna)
- **Validity Start Height**: The block height from which the transaction is valid

## Creating Your First Transaction

Looking at the `index.js` file, we have our wallet setup and faucet request from previous lessons. Now we'll add transaction functionality.

## Step 1: Create a Recipient Address

First, let's create a recipient address to send funds to. Add this code after receiving faucet funds:

```js
// Create a recipient address (another test wallet)
const recipientEntropy = Entropy.generate()
const recipientAddress = Nimiq.Address.derive(recipientEntropy)
console.log('📧 Recipient address:', recipientAddress.toUserFriendlyAddress())
```

## Step 2: Get Current Block Height

We need the current block height to set the validity start height for our transaction. Add this code:

```js
// Get current block height
const currentHeight = await client.getBlockNumber()
console.log('📊 Current block height:', currentHeight)
```

## Step 3: Create the Transaction

Now let's create a transaction to send 1 NIM to the recipient. Add this code:

```js
// Create a transaction
const transaction = new Nimiq.Transaction(
  wallet.address,           // sender
  recipientAddress,         // recipient  
  Nimiq.Policy.coinsToLunas(1), // value (1 NIM in Luna)
  Nimiq.Policy.coinsToLunas(0.00001), // fee (0.00001 NIM in Luna)
  currentHeight,            // validity start height
  Nimiq.Transaction.Type.BASIC // transaction type
)

console.log('📝 Transaction created:')
console.log('  From:', transaction.sender.toUserFriendlyAddress())
console.log('  To:', transaction.recipient.toUserFriendlyAddress())
console.log('  Amount:', Nimiq.Policy.lunasToCoins(transaction.value), 'NIM')
console.log('  Fee:', Nimiq.Policy.lunasToCoins(transaction.fee), 'NIM')
```

## Step 4: Sign the Transaction

Now we need to sign the transaction with our private key. Add this code:

```js
// Sign the transaction
const signature = Nimiq.Signature.create(wallet.keyPair.privateKey, wallet.keyPair.publicKey, transaction.serializeContent())
const signedTransaction = new Nimiq.SignedTransaction(transaction, signature)

console.log('✅ Transaction signed!')
console.log('Signature:', signature.toHex())
```

## Step 5: Verify the Signature

Let's verify that our signature is valid before sending. Add this code:

```js
// Verify the signature
const isValid = signedTransaction.verify()
console.log('🔐 Signature valid:', isValid)
```

## Understanding the Process

When you run this code, you'll see:
1. A recipient address is generated
2. The current block height is retrieved
3. A transaction is created with all necessary details
4. The transaction is signed with your private key
5. The signature is verified to ensure it's correct

## What's Next?

In the next lesson, we'll learn how to send this signed transaction to the network and watch for confirmation!

💡 **Note**: We're creating the recipient address randomly for demonstration. In a real application, you would use an existing address where you want to send funds. 
