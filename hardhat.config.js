require('@nomiclabs/hardhat-waffle');

require('@openzeppelin/hardhat-upgrades');
require('solidity-coverage');
require('hardhat-abi-exporter');
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-defender');
require('hardhat-gas-reporter');
require('dotenv').config()
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.0',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: 'https://eth-mainnet.alchemyapi.io/v2/WpZq7dbPsInJFOhzMtNSNXkib7dL7A1O',
        blockNumber: 12644052,
      },
    },
    kovan: {
      url: `https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
      accounts: [process.env.PRIVKEY],
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 100000,
  },
};
