---
type: lesson
title: Requesting Testnet Funds from Faucet
focus: /index.js
terminal:
  panels: ['output']
---

# Requesting Testnet Funds from Faucet

Now that we have a wallet, we need some testnet NIM to work with. The Nimiq testnet provides a faucet service that gives free testnet coins for development and testing purposes.

## Understanding the Faucet

- The **faucet** is a service that gives away free testnet NIM
- Testnet NIM has no real value - it's only for testing
- You can request funds multiple times for testing purposes
- The faucet helps developers test their applications without using real money

## Making HTTP Requests

To request funds from the faucet, we'll make an HTTP request to the faucet API. We'll use Node.js's built-in `fetch` function to make the request.

Looking at the `index.js` file, you can see we have our wallet setup from the previous lesson. Now we'll add faucet functionality.

## Step 1: Create a Faucet Request Function

First, let's create a function to request funds from the faucet. Add this function before the main function:

```js
async function requestFromFaucet(address) {
  const faucetUrl = 'https://faucet.pos.nimiq-testnet.com/tapit'
  
  try {
    console.log('💧 Requesting funds from faucet...')
    
    const response = await fetch(faucetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `address=${address.toUserFriendlyAddress()}`
    })
    
    if (response.ok) {
      console.log('✅ Faucet request successful!')
      return true
    } else {
      console.log('❌ Faucet request failed:', response.status)
      return false
    }
  } catch (error) {
    console.error('❌ Error requesting from faucet:', error.message)
    return false
  }
}
```

## Step 2: Request Funds After Creating Wallet

Now let's call the faucet function after we create our wallet. Add this code after displaying the wallet information:

```js
// Request funds from faucet
const faucetSuccess = await requestFromFaucet(wallet.address)
```

## Step 3: Wait and Check Balance Again

Since it takes a moment for the transaction to be processed, let's wait a bit and then check our balance again. Add this code after the faucet request:

```js
if (faucetSuccess) {
  console.log('⏳ Waiting for faucet transaction to be processed...')
  
  // Wait for a few seconds
  await new Promise(resolve => setTimeout(resolve, 5000))
  
  // Check balance again
  const newBalance = await client.getBalance(wallet.address)
  console.log('New Balance:', Nimiq.Policy.lunasToCoins(newBalance), 'NIM')
  
  if (newBalance > 0) {
    console.log('🎉 Successfully received testnet funds!')
  } else {
    console.log('⏳ Transaction might still be processing. Try checking again in a moment.')
  }
}
```

## Understanding the Process

When you run this code, you'll see:
1. The wallet is created and displays a 0 NIM balance
2. A request is made to the faucet API
3. The application waits for the transaction to be processed
4. The balance is checked again and should show the received funds

## Testnet vs Mainnet

**Important**: This faucet only works on the testnet. Never send real NIM to testnet addresses, and never try to use testnet NIM as real currency.

In the next lesson, we'll learn how to create and sign our own transactions!

💡 **Tip**: If the faucet request fails, it might be because you've reached the rate limit. Try again in a few minutes. 
