/**
 * Simple HTTP client to test the BSC MCP HTTP server without using SDK
 * We'll use fetch to directly call the server endpoints
 */

import fetch from 'node-fetch';

/**
 * Simple HTTP client for testing BSC MCP server
 */
class SimpleHttpClient {
  private baseUrl: string;

  /**
   * Constructor
   * @param baseUrl The base URL of the MCP server
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Send hello message to get server info
   */
  async sendHello(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/hello`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      return await response.json();
    } catch (error) {
      console.error('Error sending hello:', error);
      throw error;
    }
  }

  /**
   * Call a tool on the MCP server
   * @param toolName The name of the tool to call
   * @param args The arguments to pass to the tool
   */
  async callTool(toolName: string, args: any = {}): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/tools/${toolName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(args)
      });

      return await response.json();
    } catch (error) {
      console.error(`Error calling tool ${toolName}:`, error);
      throw error;
    }
  }

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<any> {
    return this.callTool('get-block-number');
  }

  /**
   * Get block details
   * @param blockHashOrNumber Block hash or number
   */
  async getBlock(blockHashOrNumber: string | number): Promise<any> {
    return this.callTool('get-block', { blockHashOrNumber });
  }

  /**
   * Get transaction details
   * @param txHash Transaction hash
   */
  async getTransaction(txHash: string): Promise<any> {
    return this.callTool('get-transaction', { txHash });
  }

  /**
   * Get transaction receipt
   * @param txHash Transaction hash
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    return this.callTool('get-transaction-receipt', { txHash });
  }

  /**
   * Get account balance
   * @param address Account address
   */
  async getBalance(address: string): Promise<any> {
    return this.callTool('get-balance', { address });
  }

  /**
   * Get token balance
   * @param tokenAddress Token contract address
   * @param walletAddress Wallet address
   */
  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<any> {
    return this.callTool('get-token-balance', { tokenAddress, walletAddress });
  }

  /**
   * Create a new Four.meme token
   * @param name Token name
   * @param symbol Token symbol
   * @param initialSupply Initial token supply
   * @param decimals Token decimals
   * @param ownerAddress Owner address
   */
  async createFourMemeToken(
    name: string,
    symbol: string,
    initialSupply: number,
    decimals: number,
    ownerAddress: string
  ): Promise<any> {
    return this.callTool('create-four-meme-token', {
      name,
      symbol,
      initialSupply,
      decimals,
      ownerAddress
    });
  }
}

/**
 * Main function to test the BSC MCP HTTP server
 */
async function main() {
  const client = new SimpleHttpClient('http://localhost:3000');

  try {
    // Get server info
    console.log('Getting server info...');
    const serverInfo = await client.sendHello();
    console.log('Server info:', serverInfo);
    console.log();

    // Get current block number
    console.log('Getting current block number...');
    const blockNumberResponse = await client.getBlockNumber();
    console.log('Block number response:', blockNumberResponse);
    console.log();

    // Get balance of an address
    const address = '0x8894e0a0c962cb723c1976a4421c95949be2d4e3'; // Binance Hot Wallet
    console.log(`Getting balance for ${address}...`);
    const balanceResponse = await client.getBalance(address);
    console.log('Balance response:', balanceResponse);
    console.log();

    // Example of creating a Four.meme token (commented out as it requires a private key)
    /*
    console.log('Creating Four.meme token...');
    const tokenResponse = await client.createFourMemeToken(
      'Four Pepe',
      '4PEPE',
      420690000000,
      18,
      '0xYourWalletAddress' // Replace with a real address
    );
    console.log('Token creation response:', tokenResponse);
    console.log();
    */
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main().catch(console.error);
