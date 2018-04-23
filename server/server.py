from flask import Flask, render_template, request
import os

app = Flask(__name__)

app.config.update(
  DEBUG=True,
  TEMPLATES_AUTO_RELOAD=True)

@app.route("/")
def hello():
  return render_template('entry.html')

@app.route("/createDAO", methods=['POST'])
def createDAO():
  daoData = request.get_json()
  print(daoData)
  return "nice."
  
@app.route("/createProposal", methods=['POST'])
def createProposal():
  print(request.form)
  print(request.form['name'])
  return "nice."

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

# should use 'flask run' instead
#if __name__ == '__main__':
  #port = int(os.environ.get('PORT', 5000))
  #app.run(host='0.0.0.0', port=port)
