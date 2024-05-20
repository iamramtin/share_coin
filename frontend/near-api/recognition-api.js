import { connect, keyStores, WalletConnection, Contract } from 'near-api-js'
import { getConfig } from '../config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development');
const RECOGNITION_CONTRACT_NAME = "dev-1667684507391-70919502576121";

let account;
let recognitionContract;

///////////////////////////////////////////////////////////////////////////////////////////
//    INIT THINGS
///////////////////////////////////////////////////////////////////////////////////////////

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

export async function initRecognitionContract() {
  initSignedInAccount();
  connectNear();

  try {
    recognitionContract = new Contract(
      account,
      RECOGNITION_CONTRACT_NAME,
      {
        viewMethods: [
          "all_recognitions",
          "all_tokens",
          "all_members",
          "account_tokens",
          "account_recognitions",
          "account_recognitions_size"
        ],
        changeMethods: [
          "recognize",
        ],
        sender: account
      }
    );
  }
  catch (e) {
    console.log(e);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////
//    RECOGNITION CONTRACT
///////////////////////////////////////////////////////////////////////////////////////////

export async function getSignedInUser() {
  let account = window.walletConnection.account();
  let signedInUser = Object.values(account)[2];

  return signedInUser;
}

export async function allRecognitions() {
  initRecognitionContract();
  return await recognitionContract.all_recognitions();
}

export async function allMembers() {
  initRecognitionContract();
  console.log(recognitionContract.all_members());
  return await recognitionContract.all_members();
}

export async function allTokens() {
  initRecognitionContract();
  console.log(recognitionContract.all_tokens());
  return await recognitionContract.all_tokens();
}

export async function accountTokens() {
  initRecognitionContract();
  const account = window.walletConnection.account();

  return await recognitionContract.account_tokens(
    {
      account_id: account.accountId
    },
  );
}

export async function accountRecognitions() {
  initRecognitionContract();
  const account = window.walletConnection.account();

  return await recognitionContract.account_recognitions(
    {
      account_id: account.accountId
    },
  );
}

export async function accountRecognitionsSize() {
  initRecognitionContract();
  console.log(recognitionContract.account_recognitions_size());
  return await recognitionContract.account_recognitions_size();
}

export async function recognise(receiverId, recognitionAmount, message) {
  try {
    initRecognitionContract();
    const account = window.walletConnection.account();

    await account.functionCall({
      contractId: RECOGNITION_CONTRACT_NAME,
      methodName: 'recognize',
      args: {
        'receiver_id': receiverId,
        'recognition_amount': recognitionAmount,
        'message': message
      },
      gas: '300000000000000',
    });

    console.log(`You have given ${receiverId} ${recognitionAmount} recognition tokens!`)
  }
  catch (e) {
    console.log(e);
  }
}