---
type: lesson
title: Sending Transactions and Using Data Fields
focus: /index.js
terminal:
  panels: ['output']
---

# Sending Transactions and Using Data Fields

Now that we know how to create and sign transactions, let's learn how to send them to the network and explore transactions with data fields for storing additional information.

## Understanding Transaction Broadcasting

- **Broadcasting** means sending your signed transaction to the network
- Once broadcast, miners will include your transaction in the next block
- You can track the transaction status and wait for confirmation
- **Data fields** allow you to attach arbitrary data to transactions

## Types of Transactions

Nimiq supports different transaction types:
- **BASIC**: Simple value transfer between addresses
- **EXTENDED**: Transactions that can include a data field for additional information

## Sending Your First Transaction

Looking at the `index.js` file, we have our transaction creation and signing from the previous lesson. Now we'll add broadcasting functionality.

## Step 1: Send the Basic Transaction

First, let's send our basic transaction to the network. Add this code after verifying the signature:

```js
if (isValid) {
  console.log('📡 Sending transaction to network...')
  
  try {
    const txHash = await client.sendTransaction(signedTransaction)
    console.log('✅ Transaction sent!')
    console.log('Transaction hash:', txHash.toHex())
    
    // Wait for transaction confirmation
    console.log('⏳ Waiting for confirmation...')
    await client.waitForTransactionConfirmation(txHash)
    console.log('🎉 Transaction confirmed!')
    
    // Check balances after transaction
    const senderBalance = await client.getBalance(wallet.address)
    const recipientBalance = await client.getBalance(recipientAddress)
    
    console.log('📊 Final balances:')
    console.log('  Sender:', Nimiq.Policy.lunasToCoins(senderBalance), 'NIM')
    console.log('  Recipient:', Nimiq.Policy.lunasToCoins(recipientBalance), 'NIM')
    
  } catch (error) {
    console.error('❌ Error sending transaction:', error.message)
  }
}
```

## Step 2: Create a Transaction with Data

Now let's create a second transaction that includes a data field. Add this code after the first transaction:

```js
// Create a transaction with data field
console.log('\n🔄 Creating transaction with data field...')

const message = 'Hello from Nimiq tutorial!'
const dataBytes = new TextEncoder().encode(message)

// Create an extended transaction with data
const extendedTransaction = new Nimiq.ExtendedTransaction(
  wallet.address,           // sender
  Nimiq.Account.Type.BASIC, // sender type
  recipientAddress,         // recipient
  Nimiq.Account.Type.BASIC, // recipient type
  Nimiq.Policy.coinsToLunas(0.5), // value (0.5 NIM)
  Nimiq.Policy.coinsToLunas(0.00001), // fee
  currentHeight + 10,       // validity start height (future block)
  Nimiq.Transaction.Flag.NONE, // flags
  dataBytes                 // data field
)

console.log('📝 Extended transaction created:')
console.log('  Amount:', Nimiq.Policy.lunasToCoins(extendedTransaction.value), 'NIM')
console.log('  Data:', message)
console.log('  Data bytes:', dataBytes.length, 'bytes')
```

## Step 3: Sign and Send the Extended Transaction

Now let's sign and send the extended transaction. Add this code:

```js
// Sign the extended transaction
const extSignature = Nimiq.Signature.create(
  wallet.keyPair.privateKey, 
  wallet.keyPair.publicKey, 
  extendedTransaction.serializeContent()
)
const signedExtTransaction = new Nimiq.SignedTransaction(extendedTransaction, extSignature)

console.log('✅ Extended transaction signed!')

// Verify and send
const extIsValid = signedExtTransaction.verify()
console.log('🔐 Extended signature valid:', extIsValid)

if (extIsValid) {
  console.log('📡 Sending extended transaction to network...')
  
  try {
    const extTxHash = await client.sendTransaction(signedExtTransaction)
    console.log('✅ Extended transaction sent!')
    console.log('Transaction hash:', extTxHash.toHex())
    
    // Wait for confirmation
    console.log('⏳ Waiting for extended transaction confirmation...')
    await client.waitForTransactionConfirmation(extTxHash)
    console.log('🎉 Extended transaction confirmed!')
    
    // Get transaction details to verify data field
    const txDetails = await client.getTransaction(extTxHash)
    if (txDetails && txDetails.data) {
      const receivedMessage = new TextDecoder().decode(txDetails.data)
      console.log('📄 Data field content:', receivedMessage)
    }
    
  } catch (error) {
    console.error('❌ Error sending extended transaction:', error.message)
  }
}
```

## Understanding the Process

When you run this code, you'll see:
1. The basic transaction is sent and confirmed
2. Balances are updated to reflect the transfer
3. An extended transaction with data is created
4. The extended transaction is signed and sent
5. The data field content is verified after confirmation

## Use Cases for Data Fields

Data fields can be used for:
- **Messages**: Sending text messages with payments
- **Metadata**: Storing transaction-related information
- **Smart contracts**: Triggering contract functions
- **Proof of existence**: Timestamping documents on the blockchain

## Transaction Fees

Notice that transactions with data fields may require higher fees due to the additional data being stored on the blockchain.

🎉 **Congratulations!** You've successfully learned how to create, sign, and send both basic and extended transactions on the Nimiq network!

💡 **Tip**: Always verify your transactions are valid before sending them to avoid losing fees on invalid transactions. 
