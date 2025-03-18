import express from "express";
import * as cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BSCService } from "./bsc-service.js";
import { ethers } from "ethers";

// Augment McpServer interface to add our custom methods
declare module '@modelcontextprotocol/sdk/server/mcp.js' {
  interface McpServer {
    tool: any; // Use any type to avoid strict typing issues
  }
}

// Define the BSC RPC URL - mainnet by default
const BSC_RPC_URL = process.env.BSC_RPC_URL || "https://bsc-dataseed.binance.org/";
// Get the private key from environment variable (needed for token creation)
const BSC_PRIVATE_KEY = process.env.BSC_PRIVATE_KEY || "";

// Set the port for the HTTP server
const PORT = parseInt(process.env.PORT || "3000", 10);

// Create a BSC service instance
const bscService = new BSCService(BSC_RPC_URL, BSC_PRIVATE_KEY);

// Create an MCP server
const server = new McpServer({
  name: "BSC Explorer",
  version: "1.0.0",
  description: "MCP server for interacting with Binance Smart Chain"
});

// Get available tools information
interface Tool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

// Maintain a record of registered tools
const registeredTools: Record<string, Function> = {};

// Override the tool method to store tool functions
const originalTool = server.tool.bind(server);
server.tool = function(name: string, params: any, handler: Function) {
  registeredTools[name] = handler;
  return originalTool(name, params, handler);
};

// Add method to list all available tools
function listTools(): Tool[] {
  // This would need to be implemented more completely to match
  // the actual tools interface, but this is a placeholder
  return Object.keys(registeredTools).map(name => ({
    name,
    description: "", // We don't store descriptions separately
    parameters: {}
  }));
}

// Add method to get a tool function by name
function getToolFunction(name: string): Function | null {
  return registeredTools[name] || null;
}

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

// Create Express app
const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Root endpoint
app.get("/", (req, res) => {
  res.send("BSC MCP HTTP/SSE Server is running");
});

// Endpoint for MCP hello message
app.post("/mcp/hello", async (req, res) => {
  try {
    // Return server info and available tools
    res.json({ version: "1.0.0", name: "BSC Explorer", tools: listTools() });
  } catch (error) {
    console.error("Error processing hello:", error);
    res.status(500).json({
      error: `Server error: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

// Endpoint for MCP tool calls
app.post("/mcp/tools/:toolName", async (req, res) => {
  try {
    const { toolName } = req.params;
    const args = req.body;
    
    // Get tool function and call it
    const toolFn = getToolFunction(toolName);
    if (!toolFn) {
      res.status(404).json({ error: `Tool '${toolName}' not found` });
      return;
    }
    
    const result = await toolFn(args);
    res.json(result);
  } catch (error) {
    console.error(`Error calling tool: ${error}`);
    res.status(500).json({
      error: `Server error: ${error instanceof Error ? error.message : String(error)}`
    });
  }
});

// SSE endpoint for streaming connections
app.get("/mcp/sse", (req, res) => {
  const headers = {
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache"
  };
  res.writeHead(200, headers);

  // Helper to send SSE messages
  const send = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send a connected event
  send({ type: "connected" });

  // Handle client disconnection
  req.on("close", () => {
    res.end();
    console.log("Client disconnected from SSE");
  });
});

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`BSC MCP HTTP/SSE server is running on port ${PORT}`);
  console.log(`- Root endpoint: http://localhost:${PORT}/`);
  console.log(`- SSE endpoint: http://localhost:${PORT}/mcp/sse`);
  console.log(`- Hello endpoint: http://localhost:${PORT}/mcp/hello`);
  console.log(`- Tool calls: http://localhost:${PORT}/mcp/tools/:toolName`);
});
