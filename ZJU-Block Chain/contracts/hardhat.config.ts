import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x632df85c19a72ff0d8437cfedff5585f752492d48915af7541960ee4d858f97b',
        '0x20299b43bb76470d936785e6600d7e98ae8a8306aea1553abc9da81505ad2081',
        '0x2ff633deb3873a4c44d10cea13cd35e42bd8e564d295abbad4d6d4e1551da123',
        '0x902748e4780a4044eda270ded941afe7b3cf54777123716a40df0f5484ebf5d4',
        '0xfa650d857f2622554002e2d817c5899b9a0462dd27efe3c347b7242433c378c3'
      ]
    },
  },
};

export default config;
