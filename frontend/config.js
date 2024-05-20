import { keyStores } from 'near-api-js'

const MEMBERSHIP = process.env.MEMBERSHIP || 'membership.synthesiscoin.testnet'
const RECOGNITION = process.env.RECOGNITION || 'recognition.synthesiscoin.testnet'

export function getConfig(env) {
  switch (env) {
    case 'production':
    case 'mainnet':
      return {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
        contractName: MEMBERSHIP,
        walletUrl: 'https://wallet.near.org',
        helperUrl: 'https://helper.mainnet.near.org',
        explorerUrl: 'https://explorer.mainnet.near.org',
        jsvmAccountId: 'jsvm.near'
      }
    case 'development':
    case 'testnet':
      return {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        contractName: MEMBERSHIP,
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
        walletUrl: 'https://wallet.testnet.near.org',
        helperUrl: 'https://helper.testnet.near.org',
        explorerUrl: 'https://explorer.testnet.near.org',
        jsvmAccountId: 'jsvm.testnet'
      }
    case 'betanet':
      return {
        networkId: 'betanet',
        nodeUrl: 'https://rpc.betanet.near.org',
        contractName: MEMBERSHIP,
        walletUrl: 'https://wallet.betanet.near.org',
        helperUrl: 'https://helper.betanet.near.org',
        explorerUrl: 'https://explorer.betanet.near.org',
      }
    case 'local':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: `${process.env.HOME}/.near/validator_key.json`,
        walletUrl: 'http://localhost:4000/wallet',
        contractName: MEMBERSHIP,
      }
    case 'test':
    case 'ci':
      return {
        networkId: 'shared-test',
        nodeUrl: 'https://rpc.ci-testnet.near.org',
        contractName: MEMBERSHIP,
        masterAccount: 'test.near',
      }
    case 'ci-betanet':
      return {
        networkId: 'shared-test-staging',
        nodeUrl: 'https://rpc.ci-betanet.near.org',
        contractName: MEMBERSHIP,
        masterAccount: 'test.near',
      }
    default:
      throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`)
  }
}


export const microsoftLogin = {
  appId: 'a82b27bb-1429-4d47-9780-d649c69e99fd',
  redirectUrl: 'https://localhost:1234',
  scopes: [
    'email',
    'offline_access',
    'openid',
    'profile',
    'user.read',
  ],
  authority: 'https://login.microsoftonline.com/synthesis.co.za'
}