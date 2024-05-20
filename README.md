Using NEAR-Cli
==============
near view $CONTRACT_NAME view_function
near call $CONTRACT_NAME call_function '{"arg": "value"}' --accountId $CONTRACT_NAME

Run frontend
============

Run `npm run build && npm run start [CONTRACT_NAME]` from within the project folder.

Deploy
======

Build & deploy to temp contract: npm run build && near dev-deploy build/contract.wasm --initFunction init --initArgs '{}'
 
Every smart contract in NEAR has its [own associated account][NEAR accounts]. 
Run `npm run deploy [CONTRACT_NAME]` from within the project folder to deploy the smart contract to the live NEAR TestNet with a temporary dev account.

To run both: `npm run deploy [CONTRACT_NAME] && npm run start [CONTRACT_NAME]`


When you're ready to make it permanent, here's how:

Step 0: Install near-cli (optional)
-------------------------------------

[near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain. It was installed to the local `node_modules` folder when you ran `npm install`, but for best ergonomics you may want to install it globally:

    npm install --global near-cli

Or, if you'd rather use the locally-installed version, you can prefix all `near` commands with `npx`

Ensure that it's installed with `near --version` (or `npx near --version`)


Step 1: Create an account for the contract
------------------------------------------

Each account on NEAR can have at most one contract deployed to it. If you've already created an account such as `your-name.testnet`, you can deploy your contract to `near-blank-project.your-name.testnet`. Assuming you've already created an account on [NEAR Wallet], here's how to create `near-blank-project.your-name.testnet`:

1. Authorize NEAR CLI, following the commands it gives you:

      near login

2. Create a subaccount (replace `YOUR-NAME` below with your actual account name):

      near create-account near-blank-project.YOUR-NAME.testnet --masterAccount YOUR-NAME.testnet

Step 2: deploy the contract
---------------------------

Use the CLI to deploy the contract to TestNet with your account ID.
Replace `PATH_TO_WASM_FILE` with the `wasm` that was generated in `contract` build directory.

    near deploy --accountId near-blank-project.YOUR-NAME.testnet --wasmFile PATH_TO_WASM_FILE


Step 3: set contract name in your frontend code
-----------------------------------------------

Modify the line in `src/config.js` that sets the account name of the contract. Set it to the account id you used above.

    const CONTRACT_NAME = process.env.CONTRACT_NAME || 'near-blank-project.YOUR-NAME.testnet'


Troubleshooting
===============

On Windows, if you're seeing an error containing `EPERM` it may be related to spaces in your path. Please see [this issue](https://github.com/zkat/npx/issues/209) for more details.


  [create-near-app]: https://github.com/near/create-near-app
  [Node.js]: https://nodejs.org/en/download/package-manager/
  [jest]: https://jestjs.io/
  [NEAR accounts]: https://docs.near.org/concepts/basics/account
  [NEAR Wallet]: https://wallet.testnet.near.org/
  [near-cli]: https://github.com/near/near-cli
  [gh-pages]: https://github.com/tschaub/gh-pages


Other things
===============

https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm
https://docs.near.org/concepts/basics/accounts/creating-accounts

# Step-by-step Guide:
1. Create a near wallet: https://wallet.testnet.near.org/create
2. Install near-cli: npm i near-cli
3. Login with main account: near login
4. Create a sub-account: near create-account helloworld.ramtin.testnet --masterAccount ramtin.testnet
5. Compile rust into wasm: wasm-pack build --target web
6. Deploy the wasm executable to "helloworld.ramtin.testnet": near deploy --accountId helloworld.ramtin.testnet --wasmFile pkg/helloworld_bg.wasm --initFunction new --initArgs {}
7. Redeploy the wasm executable to "helloworld.ramtin.testnet": near deploy --accountId helloworld.ramtin.testnet --wasmFile pkg/helloworld_bg.wasm

# View functions (immutable - only read state of contract)
near view helloworld.ramtin.testnet get_name {}

# Call functions (mutable - change state of contract)
near call helloworld.ramtin.testnet get_name {} --accountId helloworld.ramtin.testnet