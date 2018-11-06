import yaml
import datetime

def generate_workspace_project_file(name,author,cfile=None):
    yaml.dump({'Workspace':name,
              'Author':author,
              'Created_On' : datetime.datetime.now()},stream=cfile , default_flow_style=False)