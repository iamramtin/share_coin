CONTRACT_NAME=$1

if [[ $CONTRACT_NAME == "Recognition" ]]; then
    unset RECOGNTIION
    export RECOGNTIION="recognition.synthesiscoin.testnet"
    echo "\nRECOGNTIION = $RECOGNTIION"
elif [[ $CONTRACT_NAME == "Membership" ]]; then
    unset MEMBERSHIP
    export MEMBERSHIP="membership.synthesiscoin.testnet"
    echo "\nMEMBERSHIP = $MEMBERSHIP"
fi
