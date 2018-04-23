const express = require('express')
const bodyParser = require('body-parser')
const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')

const app = express()

app.use(bodyParser.json())

const CHALLENGE_DESCRIPTION = "Authorization challenge"
const CHALLENGE_VALUE = "from getline"

const msgParams = [{
  type: 'string',
  name: CHALLENGE_DESCRIPTION,
  value: CHALLENGE_VALUE
}];

/*
  {
    result: String,
    addresses: Array
  }
*/
app.get('/', (req, res) => res.send('hello world'))
app.post('/', (req, res) => {
  console.log('fdsafsa')
  console.log(req.body)
  console.log(req.body)
  const recovered = sigUtil.recoverTypedSignature({ data: msgParams, sig: req.body.result })
  const match = req.body.addresses.find((address) => recovered === address)
  if (match) {
    return res.send({ auth: true })
  }
  return res.send({ auth: false })
})

app.listen(5001, () => console.log('App listening on port 5001!'))
