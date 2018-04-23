from flask import Flask, render_template, request
from datetime import datetime
from pprint import pformat
import os
import subprocess
import json

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
  timestamp = str(datetime.now()).replace(" ", ":")
  dao_filepath = "".join(["../usergenerated/dao/dao-", timestamp, '.json'])
  with open(dao_filepath, 'w') as f:
    f.write(json.dumps(daoData, indent=4))
  run_deployment_script('2_createDAO.js', [dao_filepath])
  print(daoData)
  return "nice."

def run_deployment_script(script_name, args_list):
  print(os.getcwd())
  old_path = "".join(["../notmigrations/", script_name])
  new_path = "".join(["../migrations/", script_name])
  os.rename(old_path, new_path)
  output = subprocess.check_output(" ".join(["truffle migrate"] + args_list), shell=True)
  print(output)
  os.rename(new_path, old_path)

@app.route("/tempdao")
def tempdao():
  choices = [
    { 
      'name': 'Actual',
      'vote_count': 12,
      'code': 'fdsafsda'
    },
    { 
      'name': 'No action',
      'vote_count': 10,
      'code': ''
    }
  ]

  proposals = [{
    'name': 'Joe Wang',
    'address': 'idk',
    'description': 'fdsiojfosajodjo fdisjafod ogj  oijsjgosgjoi ffa fda agdsfadfas. asjfoisfjasdfsa.',
    'choices': choices
  }, {
    'name': 'Lucas Nanda',
    'address': 'addresses',
    'description': 'fdsilafjasfjiofjsak',
    'choices': choices,
  }]

  members = [{
    'name': 'Joe Wang',
    'address': 'idk',
    'role': 'Employee'
  }, {
    'name': 'Lucas Nanda',
    'address': 'addresses',
    'role': 'Employee'
  }]

  dao = {
    'name': 'Example DAO',
    'proposals': proposals,
    'members': members
  }

  print(dao)
  
  return render_template('dao.html', dao=dao)

# should use 'flask run' instead
if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)
