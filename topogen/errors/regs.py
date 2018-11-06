class GlobalErrRegister:
    def __init__(self,regs = "ErrGlobals"):
        self.regs_name = regs
        self.components = {}
    def addcomponent(self,mapper):
        self.components[mapper.component] = mapper
    def lookup(self,code,compo_name):
        if compo_name in self.components:
            component = self.components[compo_name]
            return component.get_err(code)