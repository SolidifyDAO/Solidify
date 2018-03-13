#!/usr/bin/env bash

cd .logs

# Possibly node.*ganache will not pick up ganache-cli
if (nc -z localhost 8545); then
    echo "Using existing ganache instance on port $(ps -fade | grep -e 'node.*ganache' | head -n 1 | awk '{print $2}')"
else
    echo -n "Starting ganache instance on port $port "
    ganache-cli "$port" > ganache.log 2>&1 & echo $! > ganache.pid
    echo $(cat ganache.pid)
fi
