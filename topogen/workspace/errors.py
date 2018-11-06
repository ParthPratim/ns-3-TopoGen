from errors import mapper
from config import globalvars
def init():
    error_map = mapper.ErrMapper(component_name="workspace-manager")
    error_map.define_err("0001","Workspace already present")
    error_map.define_err("0002","No .nsproj configuration file found in the workspace")
    globalvars.ERROR_REGISTER.addcomponent(error_map)

 