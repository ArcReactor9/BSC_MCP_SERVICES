// BSC service implementation
import { ethers } from 'ethers';

/**
 * BSC service class for interacting with Binance Smart Chain network
 */
export class BSCService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet | null = null;

  /**
   * Creates a new BSC service instance
   * @param rpcUrl The BSC RPC URL to connect to
   * @param privateKey Optional private key for signing transactions
   */
  constructor(rpcUrl: string, privateKey?: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    // If a private key is provided, create a signer
    if (privateKey) {
      this.signer = new ethers.Wallet(privateKey, this.provider);
    }
  }

  /**
   * Get the current block number
   * @returns The current block number
   */
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  /**
   * Get block details by block number or hash
   * @param blockHashOrNumber Block hash or block number
   * @returns Block details
   */
  async getBlock(blockHashOrNumber: string | number): Promise<any> {
    return await this.provider.getBlock(blockHashOrNumber);
  }

  /**
   * Get transaction details by transaction hash
   * @param txHash Transaction hash
   * @returns Transaction details
   */
  async getTransaction(txHash: string): Promise<any> {
    return await this.provider.getTransaction(txHash);
  }

  /**
   * Get transaction receipt
   * @param txHash Transaction hash
   * @returns Transaction receipt
   */
  async getTransactionReceipt(txHash: string): Promise<any> {
    return await this.provider.getTransactionReceipt(txHash);
  }

  /**
   * Get balance for an address
   * @param address Wallet address
   * @returns Balance in wei
   */
  async getBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address);
  }

  /**
   * Get token balance for BEP-20 tokens
   * @param tokenAddress Token contract address
   * @param walletAddress Wallet address
   * @returns Token balance
   */
  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
    // BEP-20 balanceOf method ABI
    const abi = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)'
    ];

    try {
      const contract = new ethers.Contract(tokenAddress, abi, this.provider);
      const balance = await contract.balanceOf(walletAddress);
      const decimals = await contract.decimals();
      const symbol = await contract.symbol();
      
      // Format the balance with correct decimal places
      const formattedBalance = ethers.formatUnits(balance, decimals);
      return `${formattedBalance} ${symbol}`;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  /**
   * Creates a new Four.meme token on the BSC network
   * @param name The full name of the token
   * @param symbol The token symbol
   * @param initialSupply The initial token supply to mint
   * @param decimals The number of decimal places for the token
   * @param ownerAddress The address that will receive the initial token supply
   * @returns Object with token address and transaction hash
   */
  async createFourMemeToken(
    name: string, 
    symbol: string, 
    initialSupply: number,
    decimals: number,
    ownerAddress: string
  ): Promise<{ tokenAddress: string, txHash: string }> {
    if (!this.signer) {
      throw new Error("Private key not provided. Cannot create token without a signer.");
    }

    // ERC20 token contract bytecode and ABI
    const fourMemeTokenBytecode = "0x608060405234801561001057600080fd5b50604051610a64380380610a648339818101604052608081101561003357600080fd5b81019080805160405193929190846401000000008211156100535760006000fd5b83820191506020820185811115610069576000600080fd5b825186602082028301116401000000008211171561008757600080fd5b8083526020830192505050908051906020019080838360005b838110156100bb5780820151818401526020810190506100a0565b50505050905090810190601f1680156100e85780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156101085760006000fd5b838201915060208201858111156101205760006000fd5b825186602082028301116401000000008211171561013c57600080fd5b8083526020830192505050908051906020019080838360005b83811015610170578082015181840152602081019050610155565b50505050905090810190601f16801561019d5780820380516001836020036101000a031916815260200191505b506040526020016000600202013590602001600060020201359050856000600091505080519060200190610272929190610299565b5084600160006101000a81549081010260026000190116109055504608060240160405180986000905984600260006101000a8154816fffffffffffffffffffffffffffffffffffff0219169083600a0b021790555082600360006101000a8154908101026002600019011690550861031f565b82400581840091505b5090600f018254600181010460008390048302610c208131602660006c01000000000000000000000000871682860681858881608001526034860152603301528760a09091528101600083015481600285015490848801015181870101918487900191600d01929161026881f35b509050508160049080519060200190506102c99291906103bf565b505050505050505050806001600050819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405180926000825281601001526020016000905081900390a4505b600581540160005560bf565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282600f1061069d57805985557fffffffffffffffffffffff000000000000000000000000000000000000000000825550602080900360020281017fffffffffffffffffffffff0000000000000000000000000000000000000000006000905550602090500383602060008501549182600085015b8281101561088e5735603982830101526020810190506108bf565b50505050600f01600084015490820110610ac9578192505050611054815b60009392505050565b60009392505050565bfea365627a7a72305820d8a9b4f5c8a5d9a52eda15c70a17e06380bbaa0bcc6a699b8b68381cff05da8c6c6578706572696d656e74616cf564736f6c634300060c0033";
    
    const fourMemeTokenAbi = [
      "constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _initialSupply, address _owner)",
      "function name() public view returns (string memory)",
      "function symbol() public view returns (string memory)",
      "function decimals() public view returns (uint8)",
      "function totalSupply() public view returns (uint256)",
      "function balanceOf(address account) public view returns (uint256)",
      "function transfer(address recipient, uint256 amount) public returns (bool)",
      "function allowance(address owner, address spender) public view returns (uint256)",
      "function approve(address spender, uint256 amount) public returns (bool)",
      "function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)",
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event Approval(address indexed owner, address indexed spender, uint256 value)"
    ];
    
    // Calculate the total supply with decimals
    const totalSupply = ethers.parseUnits(initialSupply.toString(), decimals);
    
    // Create contract factory
    const factory = new ethers.ContractFactory(
      fourMemeTokenAbi,
      fourMemeTokenBytecode,
      this.signer
    );
    
    // Deploy the contract with constructor arguments
    try {
      const contract = await factory.deploy(
        name,
        symbol,
        decimals,
        totalSupply,
        ownerAddress
      );
      
      // Wait for deployment transaction to be mined
      const receipt = await contract.deploymentTransaction()?.wait();
      
      if (!receipt) {
        throw new Error("Failed to get deployment receipt");
      }
      
      return {
        tokenAddress: await contract.getAddress(),
        txHash: receipt.hash
      };
    } catch (error) {
      throw new Error(`Failed to deploy Four.meme token: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
