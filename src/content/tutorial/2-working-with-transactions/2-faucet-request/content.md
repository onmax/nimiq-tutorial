---
type: lesson
title: Requesting Testnet Funds from Faucet
focus: /index.js
terminal:
  panels: ['output']
---

# Requesting Testnet Funds from Faucet 💧

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

First, let's create a function to request funds from the faucet. This function uses **early returns** and **clean error handling** - modern JavaScript best practices.

Add this function before the main function:

```js
async function requestFundsFromFaucet(address) {
  console.log('💧 Requesting funds from faucet...')
  
  const response = await fetch(FAUCET_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      address: address.toUserFriendlyAddress(),
      withStackingContract: false
    })
  })

  // Early return with error if request failed
  if (!response.ok) {
    throw new Error(`Faucet request failed with status: ${response.status}`)
  }

  const data = await response.json()
  console.log('💰 Faucet request successful!')
  return data
}
```

## Step 2: Request Funds After Creating Wallet

Now let's call the faucet function after we create our wallet. Add this code after displaying the initial balance:

```js
// Request funds from faucet
await requestFundsFromFaucet(address)
```

## Step 3: Wait and Check Balance Again

Since it takes a moment for the transaction to be processed, let's wait a bit and then check our balance again:

```js
// Wait for funds to arrive
console.log('⏳ Waiting for transaction to be processed...')
await new Promise(resolve => setTimeout(resolve, 3000))

// Check balance again
const updatedAccount = await client.getAccount(address.toUserFriendlyAddress())
const updatedNim = updatedAccount.balance / 1e5
console.log(`💰 Updated Balance: ${updatedNim} NIM`)

if (updatedAccount.balance > 0) {
  console.log('✅ Funds received successfully!')
} else {
  console.log('⏳ No funds received yet. Faucet transaction might still be processing.')
}
```

## Key Programming Concepts

### Early Returns and Error Handling

Notice how our `requestFundsFromFaucet` function uses **early returns**:
- We check if the response is not OK and immediately throw an error
- This avoids deeply nested code and makes the function easier to read
- The main `try-catch` block in `main()` handles all errors in one place

### Clean Error Propagation

Instead of catching and re-throwing errors within the faucet function, we let errors bubble up to the main function's error handler. This approach:
- Reduces code duplication
- Makes error handling more predictable
- Follows modern JavaScript best practices

## Understanding the Process

When you run this code, you'll see:
1. The wallet is created and displays a 0 NIM balance
2. A request is made to the faucet API
3. The application waits for the transaction to be processed
4. The balance is checked again and should show the received funds

## Testnet vs Mainnet

**Important**: This faucet only works on the testnet. Never send real NIM to testnet addresses, and never try to use testnet NIM as real currency.

In the next lesson, we'll learn how to create and sign our own transactions!
