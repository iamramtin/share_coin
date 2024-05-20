import { connect, keyStores, WalletConnection, Contract } from 'near-api-js'
import { getConfig, MEMBERSHIP } from '../config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development');
const MEMBERSHIP_CONTRACT_NAME = nearConfig.contractName;

let account;
let membershipContract;

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

export async function initMembershipContract() {
  initSignedInAccount();
  connectNear();

  try {
    membershipContract = new Contract(
      account,
      MEMBERSHIP_CONTRACT_NAME,
      {
        viewMethods: [
          "all_members",
          "member_exists",
          "is_registered",
          "members_size"
        ],
        changeMethods: [
          "add_member",
          "register_member",
          "unregister_member",
          "remove_member"
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
//    MEMBERSHIP CONTRACT
///////////////////////////////////////////////////////////////////////////////////////////

export async function getSignedInUser() {
  let account = window.walletConnection.account();
  let signedInUser = Object.values(account)[2];

  return signedInUser;
}

export async function allMembers() {
  initMembershipContract();
  return await membershipContract.all_members();
}

export async function isRegistered() {
  initMembershipContract();

  const account = window.walletConnection.account();
  const accountId = account.accountId;

  return await membershipContract.is_registered({ id: accountId });
}

export async function memberExists() {
  initMembershipContract();

  const account = window.walletConnection.account();
  const accountId = account.accountId;

  return await membershipContract.member_exists({ id: accountId });
}

export async function registerMember() {
  try {
    initMembershipContract();

    const account = window.walletConnection.account();
    const accountId = account.accountId;

    if (!await memberExists()) addMember();
    if (await isRegistered()) {
      console.log(`Member ${accountId} is already registered!`)
    } else {
      await account.functionCall({
        contractId: nearConfig.contractName,
        methodName: 'register_member',
        args: {
          'id': accountId
        },
        gas: '300000000000000',
      });

      console.log(`Member ${accountId} has been registered!`)
    }
  }
  catch (e) {
    console.log(e);
  }
}

export async function addMember() {
  try {
    initMembershipContract();

    const account = window.walletConnection.account();
    const accountId = account.accountId;

    if (await memberExists()) {
      console.log(`Member ${accountId} already exists on the blockchain!`)
    } else {
      await account.functionCall({
        contractId: nearConfig.contractName,
        methodName: 'add_member',
        args: {
          'id': accountId
        },
        gas: '300000000000000',
      });

      console.log(`Member ${accountId} added onto the blockchain!`)
    }
  }
  catch (e) {
    console.log(e);
  }
}