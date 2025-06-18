---
type: lesson
title: Understanding Nimiq and Blockchain Basics
focus: /package.json
---

# Connecting to the Nimiq Network

## Overview

- **Nimiq** is a censorship-resistant, privacy-oriented, and decentralized blockchain-based payment protocol
- A **blockchain** is a shared digital ledger that is kept up-to-date across all users in the network through a process called establishing consensus
- Compared to most other blockchain systems, it allows a direct connection to the network using a light or pico node, even in the browser
- These light nodes use **Zero Knowledge Proofs (ZKPs)** to efficiently verify blockchain transactions and states

## Learning

Nimiq is a blockchain-based payment protocol. This technology offers several key benefits:

- **Censorship-resistant:** No one can prevent you from using it
- **Privacy-oriented:** You don't need to provide any personal information to open an account
- **Decentralized:** It's not controlled by any single person but by all its users

A blockchain is like a shared digital ledger. Keeping this ledger up to date across all users in the network is called establishing consensus. Traditionally, most blockchain systems require you to connect through a third party to avoid downloading the entire blockchain, which can be over 100 GB in size. This approach necessitates trusting the third party.

**Nimiq allows direct connection to the network** with Zero Knowledge Proofs (ZKPs) for both light and full nodes. Unlike history nodes, which download and verify the entire blockchain, light and full nodes only download the necessary data to verify the macro chain's validity. This approach significantly reduces storage and computational requirements, making light nodes ideal for devices with limited resources, such as browsers or mobile devices, and making full nodes much lighter.

## Your First Nimiq Application

In this lesson, we'll create a simple Node.js application that connects to the Nimiq test network and establishes consensus.

Look at the `package.json` file on the right. We've already set up the project with the `@nimiq/core` library which includes the Nimiq Web Client.

The project is configured as an ES module with `"type": "module"` to support modern JavaScript imports.

Now let's create the main application file to connect to the Nimiq network!
