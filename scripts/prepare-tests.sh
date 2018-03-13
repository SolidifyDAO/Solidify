#!/usr/bin/env bash

cd .logs

# export account address environment variables
# see this file for available variables
source ./scripts/ganache-accounts.sh

# export token contract address environment variable
export TOKEN_CONTRACT_ADDRESS=$(cat ./token-contract-address)

# write contract address to plist file used by xcode when testing
/usr/libexec/PlistBuddy -c "Set TOKEN_CONTRACT_ADDRESS '${TOKEN_CONTRACT_ADDRESS}'" ../KinSDK/KinSDKTests/testConfig.plist
