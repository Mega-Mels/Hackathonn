import { ethers } from 'ethers';
import { Alert } from 'react-native';
import { rnWalletService } from './rnWalletService';

// BlockDAG configuration
export const BLOCKDAG_CONFIG = {
  network: {
    name: 'Primordial BlockDAG Testnet',
    rpcUrl: 'https://rpc.primordial.bdagscan.com',
    chainId: 1043,
    explorerUrl: 'https://primordial.bdagscan.com/',
    currency: 'BDAG',
    faucet: 'https://primordial.bdagscan.com/faucet'
  }
};

// Get balance function
export const getBalance = async (address: string): Promise<string> => {
  try {
    // Check if we're in a real Web3 environment
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const provider = new ethers.JsonRpcProvider(BLOCKDAG_CONFIG.network.rpcUrl);
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } else {
      // Mock balance for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      return '2.5'; // Mock balance
    }
  } catch (error) {
    console.error('Balance check failed:', error);
    return '0';
  }
};

// Submit to BlockDAG function
export const submitToBlockDAG = async (reportData: any): Promise<string> => {
  try {
    if (!rnWalletService.isConnected()) {
      throw new Error('Please connect your wallet first');
    }

    // Check if we're in a real Web3 environment
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: await signer.getAddress(),
        data: ethers.hexlify(ethers.toUtf8Bytes(JSON.stringify({
          type: 'safety_report',
          timestamp: new Date().toISOString(),
          ...reportData
        }))),
        value: 0
      });

      return tx.hash;
    } else {
      // Fallback to mock in development
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockHash = '0x' + Math.random().toString(16).substring(2, 66);
      
      Alert.alert(
        "Development Mode",
        "Using mock transaction for development. In production, this will submit to real BlockDAG network.",
        [{ text: "OK" }]
      );
      
      return mockHash;
    }

  } catch (error: any) {
    console.error('BlockDAG submission error:', error);
    
    if (error.code === 4001) {
      throw new Error('Transaction rejected by user');
    }
    
    if (error.message?.includes('insufficient funds')) {
      throw new Error('Insufficient BDAG for gas fees. Please get testnet BDAG from the faucet.');
    }
    
    throw new Error(error.message || 'Failed to submit to BlockDAG');
  }
};