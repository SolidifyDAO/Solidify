#!/usr/bin/env bash

cd .logs

# Possibly node.*ganache will not pick up ganache-cli
echo -n "Starting ganache instance on port $port "
ganache-cli "$port" > ganache.log 2>&1 & echo $! > ganache.pid
echo $(cat ganache.pid)
