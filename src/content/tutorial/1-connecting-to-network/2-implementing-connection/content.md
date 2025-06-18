---
type: lesson
title: Implementing the Connection
focus: /index.js
---

# Implementing the Nimiq Connection

Now that you understand the basics of Nimiq, let's implement the connection to the network step by step.

## Using `@nimiq/core` to Establish Consensus

You have the option to interact with the Nimiq blockchain using either a web browser or Node.js through the `@nimiq/core` npm module. 

In order to connect to the network and establish consensus, you need to import the Nimiq Web package and configure the client.

Looking at the `index.js` file, you can see we've already imported the Nimiq core library:

```js
import { Client, ClientConfiguration } from '@nimiq/core'
```

Now let's implement the connection step by step:

## Step 1: Create a Client Configuration

To create a client configuration, use the `ClientConfiguration()` constructor. Replace the first TODO comment with:

```js
const config = new ClientConfiguration()
```

## Useful configurations  

- You can use `config.syncMode('pico')` to use a faster mechanism to establish consensus. Learn more about [sync mechanism](https://www.nimiq.com/developers/learn/protocol/sync-protocol/nodes-and-sync).
- You can use `config.logLevel('error')` to minimize the amount of logs in the terminal.

## Step 2: Select the Network

To configure the client to use the Nimiq Testnet, use `config.network('TestAlbatross')`. For the mainnet, you would use `'MainAlbatross'`. Replace the second TODO comment with:

```js
config.network('TestAlbatross')
```

## Step 3: Set seed nodes

> If you are connecting directly to `mainnet`, skip this step.

We have changed the name of the network we want to connect, but we need also to explicetely set the seed nodes for testnet. Replace the third TODO comment with:

```js
config.seedNodes([
  '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
  '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
])
```


## Step 4: Create the Client Instance

To create an instance of the Client, call `Client.create(config.build())`. Replace the third TODO comment with:

```js
const client = await Client.create(config.build())
```

## Step 5: Wait for Consensus

Finally, wait until the consensus is established using `client.waitForConsensusEstablished()`. Replace the fourth TODO comment with:

```js
await client.waitForConsensusEstablished()
```

These four steps are all you need to connect to the network and establish consensus!
