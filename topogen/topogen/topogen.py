from wserver import server
from workspace import manager
from config import globalvars

def init():
    server.init()

""" code = manager.create_workspace("test")
    if not error_register is None:
        print(error_register.lookup(code,"workspace-manager")) """