from config import config
import os

workspace_dir = config.WORKSPACES_DIR

def fetch_all_workspaces():
    detected = []
    workspaces = os.listdir(workspace_dir)
    for workspace in workspaces:
        if os.path.isdir(os.path.join(workspace_dir,workspace)):
            wrksp_config = os.path.join(workspace_dir,workspace,workspace+'.nsproj')
            if os.path.exists(wrksp_config) and os.path.isfile(wrksp_config):
                detected.append(workspace)
                
    return detected

def create_workspace(name):
    if os.path.exists(os.path.join(workspace_dir,name)) == False and os.path.isdir(os.path.join(workspace_dir,name)) == False:
        os.mkdir(os.path.join(workspace_dir,name))
        return (True,None)
    else:
        return (False,"0001")