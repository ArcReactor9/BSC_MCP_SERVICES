import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { BSCService } from "./bsc-service.js";
import { ethers } from "ethers";

// Define the BSC RPC URL - mainnet by default
const BSC_RPC_URL = process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/";
// Get the private key from environment variable (needed for token creation)
const BSC_PRIVATE_KEY = process.env.BSC_PRIVATE_KEY || "";

// Create a BSC service instance
const bscService = new BSCService(BSC_RPC_URL, BSC_PRIVATE_KEY);

// Create an MCP server
const server = new McpServer({
  name: "BSC Explorer",
  version: "1.0.0",
  description: "MCP server for interacting with Binance Smart Chain"
});

// Add a tool to get current block number
server.tool(
  "get-block-number",
  {},
  async () => {
    try {
      const blockNumber = await bscService.getBlockNumber();
      return {
        content: [{ type: "text", text: `Current BSC block number: ${blockNumber}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting block number: ${error}` }],
        isError: true
      };
    }
  }
);

// Add a tool to get block details
server.tool(
  "get-block",
  { blockHashOrNumber: z.union([z.string(), z.number()]) },
  async ({ blockHashOrNumber }) => {
    try {
      const block = await bscService.getBlock(blockHashOrNumber);
      return {
        content: [{ type: "text", text: JSON.stringify(block, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting block: ${error}` }],
        isError: true
      };
    }
  }
);

// Add a tool to get transaction details
server.tool(
  "get-transaction",
  { txHash: z.string() },
  async ({ txHash }) => {
    try {
      const tx = await bscService.getTransaction(txHash);
      return {
        content: [{ type: "text", text: JSON.stringify(tx, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting transaction: ${error}` }],
        isError: true
      };
    }
  }
);

// Add a tool to get transaction receipt
server.tool(
  "get-transaction-receipt",
  { txHash: z.string() },
  async ({ txHash }) => {
    try {
      const receipt = await bscService.getTransactionReceipt(txHash);
      return {
        content: [{ type: "text", text: JSON.stringify(receipt, null, 2) }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting transaction receipt: ${error}` }],
        isError: true
      };
    }
  }
);

// Add a tool to get account balance
server.tool(
  "get-balance",
  { address: z.string() },
  async ({ address }) => {
    try {
      const balance = await bscService.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      return {
        content: [{ type: "text", text: `Balance: ${formattedBalance} BNB` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting balance: ${error}` }],
        isError: true
      };
    }
  }
);

// Add a tool to get BEP-20 token balance
server.tool(
  "get-token-balance",
  { 
    tokenAddress: z.string(), 
    walletAddress: z.string() 
  },
  async ({ tokenAddress, walletAddress }) => {
    try {
      const balance = await bscService.getTokenBalance(tokenAddress, walletAddress);
      return {
        content: [{ type: "text", text: `Token Balance: ${balance}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting token balance: ${error}` }],
        isError: true
      };
    }
  }
);

// Add a tool to create Four.meme token
server.tool(
  "create-four-meme-token",
  {
    name: z.string().min(1, "Token name is required"),
    symbol: z.string().min(1, "Token symbol is required"),
    initialSupply: z.number().positive("Initial supply must be positive"),
    decimals: z.number().int().min(0).max(18).default(18),
    ownerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid BSC address format")
  },
  async ({ name, symbol, initialSupply, decimals, ownerAddress }) => {
    try {
      // Check if private key is available
      if (!BSC_PRIVATE_KEY) {
        return {
          content: [{ 
            type: "text", 
            text: "Cannot create token: BSC_PRIVATE_KEY environment variable is not set. Please provide a private key to deploy contracts." 
          }],
          isError: true
        };
      }
      
      // Create the token
      const result = await bscService.createFourMemeToken(
        name,
        symbol,
        initialSupply,
        decimals,
        ownerAddress
      );

      return {
        content: [{ 
          type: "text", 
          text: `Successfully created Four.meme token!\n\nToken Name: ${name}\nToken Symbol: ${symbol}\nToken Address: ${result.tokenAddress}\nTransaction Hash: ${result.txHash}\n\nYou can view the token on BscScan: https://bscscan.com/token/${result.tokenAddress}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating Four.meme token: ${error}` }],
        isError: true
      };
    }
  }
);

// Start the server with STDIO transport
const startServer = async () => {
  try {
    console.error("Starting BSC MCP server...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("BSC MCP server is running");
  } catch (error) {
    console.error("Error starting BSC MCP server:", error);
    process.exit(1);
  }
};

startServer();
