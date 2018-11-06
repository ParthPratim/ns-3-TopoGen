import errors.regs
import workspace.errors
import topogen.topogen as TopoGen
from config import globalvars

if __name__ == "__main__":
    err_global_regs = errors.regs.GlobalErrRegister(regs="TopogenErrors")
    globalvars.ERROR_REGISTER = err_global_regs
    workspace.errors.init()
    TopoGen.init()