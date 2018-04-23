from flask import Flask, render_template, request
from datetime import datetime
from pprint import pformat
import os
import subprocess
from flask import jsonify
import json

app = Flask(__name__)

app.config.update(
  DEBUG=True,
  TEMPLATES_AUTO_RELOAD=True)

urls = {}

@app.route("/")
def hello():
  return render_template('entry.html')

@app.route("/createDAO", methods=['POST'])
def createDAO():
  daoData = request.get_json()
  timestamp = str(datetime.now()).replace(" ", ":")
  dao_filepath = "".join(["../usergenerated/dao/dao-", timestamp, '.json'])
  with open(dao_filepath, 'w') as f:
    f.write(json.dumps(daoData, indent=4))
  addr = run_deployment_script('2_createDAO.js', [dao_filepath])
  h = addr[2:10]
  urls[h] = addr
  return jsonify({'addr': h})

@app.route("/createProposal", methods=['POST'])
def createProposal():
  print(request.form)
  print(request.form['name'])
  return "nice."

def run_deployment_script(script_name, args_list):
  print(os.getcwd())
  old_path = "".join(["../notmigrations/", script_name])
  new_path = "".join(["../migrations/", script_name])
  os.rename(old_path, new_path)
  output = subprocess.check_output(" ".join(["truffle migrate --reset"] + args_list), shell=True)
  addr = output.decode().split('\n')[-2]
  os.rename(new_path, old_path)
  return addr

@app.route("/tempdao")
def tempdao():
  choices = [
    {
      'name': 'Actual',
      'vote_count': 12
    },
    {
      'name': 'No action',
      'vote_count': 10
    }
  ]

  proposals = [{
    'name': 'Add Member',
    'address': 'idk',
    'description': 'fdsiojfosajodjo fdisjafod ogj  oijsjgosgjoi ffa fda agdsfadfas. asjfoisfjasdfsa.',
    'choices': choices,
  }, {
    'name': 'Dab on Haters',
    'address': 'addresses',
    'description': 'fdsilafjasfjiofjsak',
    'choices': choices,
  }]

  code=['console.log("hi")', '''pragma solidity ^0.4.16;
contract owned {
    address public owner;

    function owned()  public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) onlyOwner  public {
        owner = newOwner;
    }
}

contract DAO {
  function addMember(address _targetMember, bytes32 _memberName, bytes32 _roleName) public;
}

contract AddMember is owned {
  uint public i;

  function AddMember() public {
    i = 0;
  }

  function run(address DAOAddress) public {
    DAO dao = DAO(DAOAddress);
    dao.addMember(0x123, 'Joe Wang', 'employee');
  }
}
''']

  members = [{
    'name': 'Joe Wang',
    'address': 'idk',
    'role': 'Employee'
  }, {
    'name': 'Lucas Nanda',
    'address': 'addresses',
    'role': 'Employee'
  }]

  roles = [{
    'name': 'Role1',
    'voting_power': 10,
    'description': 'fdsafsfsafdsa'
  }, {
    'name': 'Role2',
    'voting_power': 15,
    'description': 'ok then'
  }]

  dao = {
    'name': 'Example DAO',
    'proposals': proposals,
    'members': members,
    'roles': roles
  }

  print(dao)

  return render_template('dao.html', dao=dao, code1=code[0], code2=code[1])

@app.route("/<string:h>")
def dao(h):
  addr = urls[h]
  return addr

# should use 'flask run' instead
if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)
