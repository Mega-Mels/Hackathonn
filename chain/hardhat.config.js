import "@nomicfoundation/hardhat-toolbox";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export default {
  solidity: "0.8.20",
  networks: {
    blockdag: {
      url: "https://rpc.primordial.bdagscan.com",
      chainId: 1043,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
