---
type: lesson
title: Congratulations! 🎉
focus: /index.js
terminal:
  panels: ['output']
---

# Congratulations! 🎉

You've successfully completed the "Connecting to the Network" tutorial! Let's review what you've accomplished.

## What You've Learned

✅ **Nimiq Fundamentals**: You now understand that Nimiq is a censorship-resistant, privacy-oriented, and decentralized blockchain-based payment protocol.

✅ **Zero Knowledge Proofs**: You learned how Nimiq uses ZKPs to allow direct connection to the network with light nodes, even in browsers.

✅ **Client Configuration**: You can create and configure a Nimiq client using `ClientConfiguration()`.

✅ **Network Connection**: You know how to connect to the Nimiq Testnet using `config.network('TestAlbatross')`.

✅ **Consensus Establishment**: You can wait for consensus to be established with `client.waitForConsensusEstablished()`.

✅ **Network Exploration**: You can retrieve and display network information like block height, network ID, and head block details.

## Your Complete Application

Your final application demonstrates a complete connection to the Nimiq network:

```js
import * as Nimiq from '@nimiq/core'

async function main() {
  console.log('🚀 Starting Nimiq Web Client Tutorial')
  
  // Create a configuration builder
  const config = new Nimiq.ClientConfiguration()
  
  // Select Testnet
  config.network('TestAlbatross')
  
  // Instantiate and launch the client
  console.log('📡 Creating client and connecting to network...')
  const client = await Nimiq.Client.create(config.build())
  
  // Wait for consensus to be established
  console.log('⏳ Waiting for consensus to be established...')
  await client.waitForConsensusEstablished()
  
  console.log('✅ Consensus established!')
  
  // Network exploration
  const blockHeight = client.blockHeight
  const networkId = client.networkId
  const headBlock = await client.getHeadBlock()
  
  console.log(`📊 Current block height: ${blockHeight}`)
  console.log(`🌐 Connected to network: ${networkId}`)
  console.log(`🧱 Head block hash: ${headBlock.hash}`)
  console.log(`⏰ Head block timestamp: ${new Date(headBlock.timestamp * 1000)}`)
}

main().catch(console.error)
```

## 🛠️ Development Setup

Your project now includes:
- **Latest Nimiq Core**: Always uses the newest version with `"@nimiq/core": "latest"`
- **Auto-reload**: Changes automatically restart the application with `pnpm run dev`
- **Manual control**: Use `pnpm run start` for single runs or restart manually with `Ctrl+C`

## Next Steps

Now that you can connect to the Nimiq network, you're ready to explore more advanced topics:

🔑 **Creating Wallets**: Learn how to generate and manage Nimiq wallets
💰 **Handling Transactions**: Send and receive NIM coins
🔍 **Querying the Blockchain**: Search for specific transactions and addresses
🏗️ **Building dApps**: Create decentralized applications on Nimiq

## Share Your Achievement

[Share your achievement on Twitter](https://twitter.com/intent/tweet?text=I%20just%20learned%20how%20to%20establish%20consensus%20using%20the%20%40nimiq%20web%20client%21%20Check%20it%20out%20here%3A%20https%3A%2F%2Fwww.nimiq.com%2Fdevelopers%2Fbuild%2Fweb-client%2Ftutorials%2Fconnecting-to-the-network) and join the friendly Nimiq Community on [Telegram](https://t.me/joinchat/AAAAAEJW-ozFwo7Er9jpHw) and [Discord](https://discord.gg/cMHemg8), fellow devs are keen to help.

Great job completing this tutorial! You're now ready to build amazing applications with Nimiq! 🚀 
