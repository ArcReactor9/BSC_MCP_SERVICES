import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as path from "path";

/**
 * Example client to demonstrate how to use the BSC MCP server
 */
const main = async () => {
  try {
    console.log("Starting BSC MCP client example...");

    // Create a client transport that connects to the server via stdio
    // Note: Adjust the paths according to your environment
    const serverPath = path.resolve(process.cwd(), "dist/index.js");
    
    const transport = new StdioClientTransport({
      command: "node",
      args: [serverPath]
    });

    // Create the client with capabilities
    const client = new Client(
      {
        name: "bsc-mcp-example-client",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    // Connect to the transport
    await client.connect(transport);
    console.log("Connected to BSC MCP server");

    // Get current block number
    console.log("\nGetting current block number:");
    const blockNumberResult = await client.callTool({
      name: "get-block-number",
      arguments: {}
    });
    
    // Type assertion for the result contents
    const blockNumberContent = blockNumberResult.content as Array<{type: string, text: string}>;
    console.log(blockNumberContent[0].text);

    // Get block details (for example, block 1000000)
    console.log("\nGetting block details:");
    const blockResult = await client.callTool({
      name: "get-block",
      arguments: {
        blockHashOrNumber: 1000000
      }
    });
    
    // Type assertion for the result contents
    const blockContent = blockResult.content as Array<{type: string, text: string}>;
    console.log(blockContent[0].text);

    // Get balance for a well-known address (Binance hot wallet)
    const binanceHotWallet = "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3";
    console.log(`\nGetting balance for address ${binanceHotWallet}:`);
    const balanceResult = await client.callTool({
      name: "get-balance",
      arguments: {
        address: binanceHotWallet
      }
    });
    
    // Type assertion for the result contents
    const balanceContent = balanceResult.content as Array<{type: string, text: string}>;
    console.log(balanceContent[0].text);

    // Get token balance (BUSD on BSC)
    const busdTokenAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";
    console.log(`\nGetting BUSD token balance for address ${binanceHotWallet}:`);
    const tokenBalanceResult = await client.callTool({
      name: "get-token-balance",
      arguments: {
        tokenAddress: busdTokenAddress,
        walletAddress: binanceHotWallet
      }
    });
    
    // Type assertion for the result contents
    const tokenBalanceContent = tokenBalanceResult.content as Array<{type: string, text: string}>;
    console.log(tokenBalanceContent[0].text);

    console.log("\nBSC MCP client example completed successfully.");
  } catch (error) {
    console.error("Error in BSC MCP client example:", error);
  } finally {
    // Ensure the process exits
    process.exit(0);
  }
};

// Run the example
main();
