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
# Clone the repository
git clone https://github.com/ArcReactor9/BSC_MCP_SERVICES.git
cd BSC_MCP_SERVICES

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Configuration

By default, the server connects to the BSC mainnet. You can customize the RPC URL and set the private key (required for token creation) using environment variables:

```bash
# Windows
set BSC_RPC_URL=https://your-custom-bsc-rpc-url
set BSC_PRIVATE_KEY=your-private-key

# Linux/macOS
export BSC_RPC_URL=https://your-custom-bsc-rpc-url
export BSC_PRIVATE_KEY=your-private-key
```

### Running the STDIO Server

The STDIO server is designed to be integrated with LLM clients that support the MCP protocol:

```bash
npm run start
# or
node dist/index.js
```

### Running the HTTP/SSE Server

The HTTP/SSE server allows connections over HTTP using Server-Sent Events:

```bash
npm run start:http
# or
node dist/server-http.js
```

By default, the server runs on port 3000. You can customize the port using the `PORT` environment variable.

### Client Examples

Several client implementations are provided to demonstrate how to use the BSC MCP server:

```bash
# Standard MCP client example
npm run client
# or
node dist/client-example.js

# HTTP client example
npm run client:http
# or
node dist/client-http-example.js

# Simple HTTP client example
npm run client:simple
# or
node dist/simple-http-client.js
```

## API Endpoints (HTTP Server)

The HTTP server exposes the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Server status check |
| `/mcp/hello` | POST | Get server information and available tools |
| `/mcp/tools/:toolName` | POST | Call a specific tool with arguments |
| `/mcp/sse` | GET | Server-Sent Events (SSE) endpoint for streaming connections |

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

The BSC MCP server includes functionality to create new Four.meme tokens on the Binance Smart Chain. This allows users to easily deploy custom meme tokens with the following parameters:

- `name`: The full name of the token (e.g., "Four Meme Token")
- `symbol`: The token symbol (e.g., "4MEME")
- `initialSupply`: The initial token supply to mint
- `decimals`: The number of decimal places for the token (typically 18)
- `ownerAddress`: The BSC address that will receive the initial token supply

### Example using HTTP Client

```javascript
// Example of creating a Four.meme token using the HTTP client
const client = new SimpleHttpClient('http://localhost:3000');

// Create a Four.meme token
const tokenResponse = await client.createFourMemeToken(
  'Four Pepe',   // Token name
  '4PEPE',       // Token symbol
  420690000000,  // Initial supply (before decimals)
  18,            // Decimals
  '0xYourWalletAddress'  // Owner address
);

console.log('Token creation response:', tokenResponse);
```

## Integration with MCP.so

To properly display this service on [mcp.so](https://mcp.so), please ensure that your repository contains the following:

1. A well-documented README.md (this file)
2. Code examples demonstrating how to use the tools
3. Clearly defined tool specifications

## Development

### Project Structure

```
BSC_MCP_SERVICES/
├── dist/               # Compiled JavaScript files
├── src/                # TypeScript source code
│   ├── bsc-service.ts  # BSC interaction service
│   ├── index.ts        # STDIO server implementation
│   ├── server-http.ts  # HTTP/SSE server implementation
│   └── ...             # Client examples and utilities
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation (this file)
```

### Building the Project

```bash
npm run build
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Troubleshooting

### Token Creation Issues

- Ensure the `BSC_PRIVATE_KEY` environment variable is set correctly
- Verify you have enough BNB to cover the gas fees for token deployment
- Check that the owner address is a valid BSC address

### Connection Issues

- Verify the RPC URL is correct and accessible
- Check network connectivity
- Ensure the server is running on the expected port

## Support

For any questions or support, please [open an issue](https://github.com/ArcReactor9/BSC_MCP_SERVICES/issues) on the GitHub repository.
