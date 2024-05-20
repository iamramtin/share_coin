CONTRACT_NAME=$1

npm run build:$CONTRACT_NAME
rm -rf contracts/$CONTRACT_NAME/neardev

cd contracts/$CONTRACT_NAME
near dev-deploy build/contract.wasm

cd ../..

if [[ $CONTRACT_NAME == "HelloNear" ]]; then
    unset HELLO_NEAR
    export HELLO_NEAR=$(cat contracts/$CONTRACT_NAME/neardev/dev-account)
    near call $HELLO_NEAR init --accountId $HELLO_NEAR
    echo "\nHELLO_NEAR = $HELLO_NEAR"

elif [[ $CONTRACT_NAME == "Membership" ]]; then
    unset MEMBERSHIP
    export MEMBERSHIP=$(cat contracts/$CONTRACT_NAME/neardev/dev-account)
    near call $MEMBERSHIP init --accountId $MEMBERSHIP
    echo "\nMEMBERSHIP = $MEMBERSHIP"
fi
