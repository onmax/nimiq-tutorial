---
type: lesson
title: Implementing the Connection
focus: /index.js
terminal:
  panels: ['output']
---

# Implementing the Nimiq Connection

Now that you understand the basics of Nimiq, let's implement the connection to the network step by step.

## Using `@nimiq/core` to Establish Consensus

You have the option to interact with the Nimiq blockchain using either a web browser or Node.js through the `@nimiq/core` npm module. 

In order to connect to the network and establish consensus, you need to import the Nimiq Web package and configure the client.

Looking at the `index.js` file, you can see we've already imported the Nimiq core library:

```js
import * as Nimiq from '@nimiq/core'
```

Now let's implement the connection step by step:

## Step 1: Create a Client Configuration

To create a client configuration, use the `ClientConfiguration()` constructor. Replace the first TODO comment with:

```js
const config = new Nimiq.ClientConfiguration()
```

## Step 2: Select the Network

To configure the client to use the Nimiq Testnet, use `config.network('TestAlbatross')`. For the mainnet, you would use `'MainAlbatross'`. Replace the second TODO comment with:

```js
config.network('TestAlbatross')
```

## Step 3: Create the Client Instance

To create an instance of the Client, call `Client.create(config.build())`. Replace the third TODO comment with:

```js
const client = await Nimiq.Client.create(config.build())
```

## Step 4: Wait for Consensus

Finally, wait until the consensus is established using `client.waitForConsensusEstablished()`. Replace the fourth TODO comment with:

```js
await client.waitForConsensusEstablished()
```

These four steps are all you need to connect to the network and establish consensus!

## 🔄 Auto-Reload Feature

The application is running with **auto-reload enabled** - any changes you make to the code will automatically restart the application. You can see this in action in the terminal output!

💡 **Tip**: If you need to manually restart the application, press `Ctrl+C` in the terminal and run `pnpm run dev` again.

Once you've implemented all the steps, the application will automatically restart and you should see the consensus being established. This might take a few moments as your client synchronizes with the network. 
