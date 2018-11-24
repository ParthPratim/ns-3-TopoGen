from wserver import server
from workspace import manager
from config import globalvars
from models import modelsmap

def init():
    #print(modelsmap.generate_map_withclasses())
    server.init()

""" code = manager.create_workspace("test")
    if not error_register is None:
        print(error_register.lookup(code,"workspace-manager")) """