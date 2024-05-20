import { connect, keyStores, WalletConnection } from 'near-api-js'
import { getConfig } from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development');

let account;
let nearConnection;

// Initialize contract and set global variables
export async function initContract() {
  // Initialize connection to the NEAR blockchain
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig));

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If signed-out, it's empty string
  window.accountId = window.walletConnection.getAccountId();
}

export function signInWithNearWallet() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  console.log(nearConfig.contractName);
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

export function signOutNearWallet() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function initSignedInAccount() {
  try {
    account = window.walletConnection.account()
  }
  catch (e) {
    console.log(e);
  }
}

export function connectNear() {
  try {
    nearConnection = connect(nearConfig);
  }
  catch (e) {
    console.log(e);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
//    OTHER THINGS
///////////////////////////////////////////////////////////////////////////////////////////

export async function createAccount(acc) {
  try {
    // create a new account using funds from the account used to create it.
    await acc.createAccount(
      "syntest.testnet", // new account name
      "8hSHprDq2StXwMtNd43wDTXQYsjXcD4MJTXQYsjXcc", // public key for new account
      "10000000000000000000" // initial balance for new account in yoctoNEAR
    );
  }
  catch (e) {
    console.log(e);
  }
}

export async function deleteAccount(acc) {
  try {
    // transfers remaining account balance to the accountId passed as an argument
    await acc.deleteAccount("syntest.testnet");
  }
  catch (e) {
    console.log(e);
  }
}

export async function deployContract(acc, wasmPath) {
  try {
    const response = await acc.deployContract(fs.readFileSync(wasmPath));
    console.log(response);
  }
  catch (e) {
    console.log(e);
  }
}

export async function sendTokens(senderAcc, receiverAcc, amount) {
  try {
    await senderAcc.sendMoney(
      receiverAcc,
      amount
    );
  }
  catch (e) {
    console.log(e);
  }
}

export async function getAccountBalance() {
  try {
    let myAccount = await nearConnection.account("ramtin.testnet");
    return (await myAccount.getAccountBalance())["total"];
  }
  catch (e) {
    console.log(e);
  }
}
