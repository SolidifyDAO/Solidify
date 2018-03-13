#!/usr/bin/env bash

cd .logs

if [ -f 'ganache.pid' ]; then
    echo "killing ganache on process id $(cat ganache.pid)"
    # Don't fail if the process is already killed
    kill -SIGINT $(cat ganache.pid) || true
    rm -f ganache.pid
else
    echo "ganache.pid not found, doing nothing"
fi
