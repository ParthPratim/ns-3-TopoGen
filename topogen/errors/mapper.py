
class ErrMapper:
    def __init__(self,component_name=None):
        if not component_name is None:
            self.component = component_name
            self.errmap = {}
    def define_err(self,code,msg):
        self.errmap[code] = msg
    def get_err(self,code):
        return self.errmap[code]
