from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime
from pprint import pformat
import os
import subprocess
from flask import jsonify
import json
import requests
import time

app = Flask(__name__)

app.config.update(
  DEBUG=True,
  TEMPLATES_AUTO_RELOAD=True)

urls = {}

@app.route("/")
def hello():
  return render_template('entry.html')

@app.route("/auth")
def auth():
  dao = request.args.get('dao')
  return render_template('auth.html', dao=dao)

@app.route("/createDAO", methods=['POST'])
def createDAO():
  daoData = request.get_json()
  print(daoData)
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
  proposalData = request.form.to_dict()
  proposalData['voting_length'] = time.time() + float(proposalData['voting_length']) * 3600
  proposalData['isAddRole'] = 'votes' in proposalData
  timestamp = str(datetime.now()).replace(" ", ":")
  proposal_filepath = "".join(["../usergenerated/proposal/proposal-", timestamp, '.json'])
  with open(proposal_filepath, 'w') as f:
    f.write(json.dumps(proposalData, indent=4))
  addr = run_deployment_script('2_createProposal.js', [proposal_filepath])
  return jsonify({'end_time': proposalData['voting_length'], 'addr': addr, 'isAddRole': 'votes' in proposalData, 'data': json.dumps(proposalData)})

@app.route("/sendVote", methods=['POST'])
def sendVote():
  voteInfo = request.get_json()
  print(voteInfo)
  timestamp = str(datetime.now()).replace(" ", ":")
  vote_filepath = "".join(["../usergenerated/vote/vote-", timestamp, '.json'])
  with open(vote_filepath, 'w') as f:
    f.write(json.dumps(voteInfo, indent=4))
  updated_count = run_vote_script([vote_filepath])
  print(updated_count)
  return jsonify({'updatedCount': updated_count})

@app.route("/executeProposal", methods=['POST'])
def executeProposal():
  proposalAddress = request.get_json()['proposalAddress']
  winning_choice_index = run_exec_choice_script([proposalAddress])
  return jsonify({'winningChoiceIdx': winning_choice_index})


def run_deployment_script(script_name, args_list):
  old_path = "".join(["../notmigrations/", script_name])
  new_path = "".join(["../migrations/", script_name])
  os.rename(old_path, new_path)
  output = subprocess.check_output(" ".join(["truffle migrate --reset"] + args_list), shell=True)
  addr = ""
  if script_name == '2_createProposal.js':
    addr = output.decode().split('\n')[-3]
  else:
    addr = output.decode().split('\n')[-2]

  os.rename(new_path, old_path)
  return addr

def run_vote_script(args_list):
  output = subprocess.check_output(" ".join(["truffle exec ../notmigrations/voteScript.js"] + args_list), shell=True)
  vote_count = output.decode().split('\n')[-2]
  return vote_count

def run_exec_choice_script(args_list):
  output = subprocess.check_output(" ".join(["truffle exec ../notmigrations/executeChoiceScript.js"] + args_list), shell=True)
  winnerIndex = output.decode().split('\n')[-2]
  return winnerIndex

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
  }, {
    'name': 'Role2',
    'voting_power': 15,
  }]

  dao = {
    'name': 'Example DAO',
    'proposals': proposals,
    'members': members,
    'roles': roles
  }

  print(dao)

  return render_template('dao.html', dao=dao, code=code)

'''@app.route("/verify")
def verify():
  dao = request.args.get('dao')
  result = request.args.get('result')
  # TODO: get real addresses from dao
  addresses = ['0x492b173e4bde8c8b225a8df4dc6fdecdf5af1c1a']
  response = requests.post('http://localhost:5001', json={'addresses': addresses, 'result': result})
  r = response.json()
  print(r)
  return redirect('/'+dao)'''

@app.route("/<string:h>")
def dao(h):
  addr = urls[h]
  output = subprocess.check_output(" ".join(["truffle exec ../notmigrations/buildFrontend.js"] + [addr]), shell=True).decode().split('\n')
  output = output[2:-1][0]
  dao = json.loads(output)
  result = request.args.get('result')
  if (result):
    # TODO: get real addresses from dao
    addresses = []
    response = requests.post('http://localhost:5001', json={'addresses': addresses, 'result': result})
    r = response.json()
    return render_template('dao.html', dao=dao)
  return redirect(url_for('auth')+'?dao='+h)

# should use 'flask run' instead
if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)
