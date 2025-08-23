// scripts/deploy.js
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const Hello = await ethers.getContractFactory("Hello");
  const hello = await Hello.deploy();
  await hello.deployed();
  console.log("Hello deployed to:", hello.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
