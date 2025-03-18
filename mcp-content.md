# BSC MCP Server Content

## Introduction

The Binance Smart Chain (BSC) Model Context Protocol (MCP) server provides Large Language Models (LLMs) with the ability to interact with the BSC blockchain, access on-chain data, and create Four.meme tokens.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Optional: BSC wallet private key (required for token creation)

### Installation

```bash
# Clone the repository
git clone https://github.com/ArcReactor9/BSC_MCP_SERVICES.git
cd BSC_MCP_SERVICES

# Install dependencies
npm install

# Build the project
npm run build
```

### Configuration

Set the following environment variables:

- `BSC_RPC_URL` - The BSC RPC endpoint (defaults to public Binance RPC)
- `BSC_PRIVATE_KEY` - Private key for token creation (only needed for token operations)
- `PORT` - HTTP server port (defaults to 3000)

## Using the Server

### Running the STDIO Server

```bash
npm run start
```

### Running the HTTP Server

```bash
npm run start:http
```

## Example Code

### Checking BSC Balance

```javascript
const client = new SimpleHttpClient('http://localhost:3000');

// Get balance of an address
const address = '0x8894e0a0c962cb723c1976a4421c95949be2d4e3';
const balanceResponse = await client.getBalance(address);
console.log('Balance:', balanceResponse);
```

### Creating a Four.meme Token

```javascript
const client = new SimpleHttpClient('http://localhost:3000');

// Create a Four.meme token
const tokenResponse = await client.createFourMemeToken(
  'Four Pepe',   // Token name
  '4PEPE',        // Token symbol
  420690000000,   // Initial supply
  18,             // Decimals
  '0xYourAddress' // Owner address
);

console.log('Token created:', tokenResponse);
```

## API Reference

### HTTP Endpoints

- `GET /` - Server status
- `POST /mcp/hello` - Server information
- `POST /mcp/tools/:toolName` - Call a tool
- `GET /mcp/sse` - SSE connection

### Tools

See the Tools section for detailed documentation on each available tool.
