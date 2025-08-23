import { Alert } from 'react-native';

class RealRNWalletService {
  private isConnectedValue: boolean = false;
  private address: string = '';

  async connect(): Promise<string> {
    try {
      // Check if we're in a Web3 environment (like MetaMask mobile browser)
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          // Request account access
          const accounts = await (window as any).ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          this.isConnectedValue = true;
          this.address = accounts[0];
          return this.address;
        } catch (error) {
          console.error('MetaMask connection failed:', error);
          // Fall through to mock connection
        }
      }
      
      // Fallback to mock for development or if Web3 fails
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.isConnectedValue = true;
      this.address = '0xD236ABf72236d128E1f723f1ed968536E321cDE0';
      
      Alert.alert(
        "Development Mode", 
        "Using mock wallet for development. For real blockchain connection:\n\n1. Use MetaMask mobile browser\n2. Ensure you have testnet BDAG from the faucet",
        [{ text: "OK" }]
      );
      
      return this.address;
      
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw new Error("Failed to connect wallet. Please try again or use MetaMask mobile browser.");
    }
  }

  getAddress(): string {
    if (!this.isConnectedValue) {
      throw new Error("Wallet not connected");
    }
    return this.address;
  }

  async getAddressAsync(): Promise<string> {
    if (!this.isConnectedValue) {
      throw new Error("Wallet not connected");
    }
    return this.address;
  }

  disconnect(): void {
    this.isConnectedValue = false;
    this.address = '';
  }

  isConnected(): boolean {
    return this.isConnectedValue;
  }

  // Helper method to check if we're in a real Web3 environment
  isWeb3Environment(): boolean {
    return typeof window !== 'undefined' && !!(window as any).ethereum;
  }
}

export const rnWalletService = new RealRNWalletService();