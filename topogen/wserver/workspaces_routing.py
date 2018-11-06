from flask import Blueprint , request
from workspace import manager
from config import globalvars

workspaces = Blueprint('workspaces',__name__)
compo_name = "workspace-manager"

@workspaces.route('/')
def home():
    return 'Workspaces home'

@workspaces.route('/all')
def fetch_all_workspaces():
    return str(manager.fetch_all_workspaces())

@workspaces.route('/create',methods=['POST'])
def create_new_workspace():
    err_regs = globalvars.ERROR_REGISTER
    name = request.form['workspace_name']
    author = request.form['author']
    status = manager.create_workspace(name,author)
    if(status[0] == True):
        return "Success"
    else:
        return err_regs.lookup(status[1],compo_name)

