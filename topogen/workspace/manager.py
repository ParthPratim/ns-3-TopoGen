from config import config
from workspace import projconfig
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

def create_workspace(name,author):
    if os.path.exists(os.path.join(workspace_dir,name)) == False and os.path.isdir(os.path.join(workspace_dir,name)) == False:
        os.mkdir(os.path.join(workspace_dir,name))
        cfile = open(os.path.join(workspace_dir,name,name+'.nsproj'),'x')
        projconfig.generate_workspace_project_file(name,author,cfile=cfile)
        cfile.close()
        return (True,None)
    else:
        return (False,"0001")