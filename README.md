# Solidify
So easy even your grandma could make a DAO!

## Setup
### Requirements

Setting up Solidify requires you to have [Truffle](http://truffleframework.com/docs/getting_started/installation) and [ganache-cli](https://github.com/trufflesuite/ganache-cli) setup on your machine.

To authenticate through the application, you also need the chrome extension [MetaMask](https://metamask.io/).

Running local servers also required Python3 and Node.

### Quick Start

First ensure that you have the following directory paths in the root directory (this is where files will be stored):

* `usergenerated/dao/`
* `usergenerated/proposal/`
* `usergenerated/vote/`

In the server/ directory, install the required dependencies using:

`pip install -r requirements.txt`

Next, turn on the Flask server using python3:

`python3 server.py`

Turn on ganache-cli and, to unlock accounts for transactions, run it with the following flag replacing the list with your secret key:

`ganache-cli -m "concert load couple harbor equip island argue ramp clarify fence smart topic"`

Finally, you need to run a local node server for authentication. Move to the auth directory and run:

`npm install`

`node index.js`

The application should be viewable at http://localhost:5000/
