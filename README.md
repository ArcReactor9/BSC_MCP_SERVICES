# BSC MCP Server

A Model Context Protocol (MCP) server for interacting with the Binance Smart Chain (BSC) network. This server enables LLMs to access blockchain data and perform queries on the BSC network.

## Features

- Get current block number
- Retrieve block details by number or hash
- Fetch transaction details
- Get transaction receipts
- Check wallet BNB balance
- Check BEP-20 token balances
- Create Four.meme tokens on BSC

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
# Clone the repository (if you're using git)
# git clone <repository-url>
# cd mcp-bsc

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Configuration

By default, the server connects to the BSC mainnet. You can customize the RPC URL by setting the `BSC_RPC_URL` environment variable:

```bash
# Windows
set BSC_RPC_URL=https://your-custom-bsc-rpc-url

# Linux/macOS
export BSC_RPC_URL=https://your-custom-bsc-rpc-url
```

### Running the STDIO Server

The STDIO server is designed to be integrated with LLM clients that support the MCP protocol:

```bash
node dist/index.js
```

### Running the HTTP/SSE Server

The HTTP/SSE server allows connections over HTTP using Server-Sent Events:

```bash
node dist/server-http.js
```

By default, the server runs on port 3000. You can customize the port using the `PORT` environment variable.

### Client Example

A sample client implementation is provided to demonstrate how to use the BSC MCP server:

```bash
node dist/client-example.js
```

## MCP Tools

This server exposes the following MCP tools:

| Tool Name | Parameters | Description |
|-----------|------------|-------------|
| `get-block-number` | None | Returns the current BSC block number |
| `get-block` | `blockHashOrNumber`: string or number | Returns block details for the given block hash or number |
| `get-transaction` | `txHash`: string | Returns transaction details for the given transaction hash |
| `get-transaction-receipt` | `txHash`: string | Returns transaction receipt for the given transaction hash |
| `get-balance` | `address`: string | Returns BNB balance for the given wallet address |
| `get-token-balance` | `tokenAddress`: string, `walletAddress`: string | Returns BEP-20 token balance for the given token and wallet address |
| `create-four-meme-token` | `name`: string, `symbol`: string, `initialSupply`: number, `decimals`: number, `ownerAddress`: string | Creates a new Four.meme token with specified parameters |

## Creating Four.meme Tokens

The BSC MCP server includes functionality to create new Four.meme tokens on the Binance Smart Chain. This allows users to easily deploy custom meme tokens using the following parameters:

- `name`: The full name of the token (e.g., "Four Meme Token")
- `symbol`: The token symbol (e.g., "4MEME")
- `initialSupply`: The initial token supply to mint
- `decimals`: The number of decimal places for the token (typically 18)
- `ownerAddress`: The BSC address that will receive the initial token supply

### Example

```javascript
// Example of creating a Four.meme token using the client API
const result = await client.callTool({
  name: "create-four-meme-token",
  arguments: {
    name: "Four Pepe",
    symbol: "4PEPE",
    initialSupply: 420690000000,
    decimals: 18,
    ownerAddress: "0xYourWalletAddress"
  }
});

console.log(result.content[0].text); // Will show the deployed token address and transaction hash
```

**Note**: Token creation requires a funded BSC wallet to pay for gas fees. You'll need to provide a private key in the `BSC_PRIVATE_KEY` environment variable for this feature to work.

## Integration with LLM Clients

This server can be integrated with any LLM client that supports the MCP protocol, such as:

- Claude Desktop App
- Continue
- Custom MCP clients using the MCP SDK

## License

ISC
