from models import modelsmap

class PYcode:
    py_code = ""
    code_components = {}
    model_class_map = modelsmap.generate_map_withclasses()
    def __init__(self,cc_file_name):
        pass
    
    def generate_code(self,components):
        self.code_components = components
    
    def add_file_mode(self):
        self.append_code("# -*-  Mode: Python; -*-")
    
    def add_license(self):
        self.break_line()
        self.append_code("# /* \n \
        #  * This program is free software; you can redistribute it and/or modify \n \
        # #  * it under the terms of the GNU General Public License version 2 as \n \
        # #  * published by the Free Software Foundation; \n \
        # #  *\n \
        # #  * This program is distributed in the hope that it will be useful,\n \
        # #  * but WITHOUT ANY WARRANTY; without even the implied warranty of\n \
        # #  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n \
        # #  * GNU General Public License for more details.\n \
        # #  *\n \
        # #  * You should have received a copy of the GNU General Public License\n \
        # #  * along with this program; if not, write to the Free Software\n \
        # #  * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA\n \
        # #  *\n \
        # #  * Ported to Python by Mohit P. Tahiliani\n \
        # #  */")
    
    def import_dependencies(self,dependencies):
        self.break_line()
        for dependency in dependencies:
            d_parts = dependency.split('::')
            if len(d_parts) == 2:
                # import from
                self.append_code('from '+d_parts[0]+' import '+d_parts[1])
            else:
                self.append_code('import '+dependency)

            self.break_line()
    
    def create_class_object(self,component):
        self.break_line()
        m_name = component["model"]
        for m_base , b_info in self.model_class_map.items():
            stop_lookup = False
            for m_info in b_info:
                if m_info["__Model__Configuration__"]["model"] == m_name:
                    py_prefix = m_info["__Model__Configuration__"]["py_prefix"]
                    self.append_code(component["varname"]+" = "+py_prefix+"."+m_name)
                    self.append_method_params(component["args"])
                    stop_lookup = True
                    break
            if stop_lookup:
                break
    
    def define_variable(self,component):
        self.break_line()
        self.append_code(component["varname"])
        if component["value"] != "":
            if component["type"] in self.cc_data_types[1:]:
                self.append_code(" = \"" + component["value"]+"\"")
            else:
                self.append_code(" = " + component["value"])
        else:
            self.append_code(" = None")
    
    def call_method(self,component):
        method = component["method"]
        class_var = component["classvar"]
        args = component["args"]
        if method == "AddValue":
            

    def append_method_params(self,arglist):
        self.append_code(" ( ")
        arg_len = len(arglist.items())
        for arg_index,arg in enumerate(arglist):
            arginfo = arglist[arg]
            argval = arginfo["value"]
            arg_suptype = argval[:argval.index('@')]
            if arg_suptype == "in_scope":
                arg_val_app = argval[argval.index('@')+1:]
                if arg_val_app == "argv":
                    self.append_code("sys.argv")
                elif arg_val_app == "argc":
                    self.append_code("len(sys.argv)")
                else:
                    self.append_code(arg_val_app)
            elif arg_suptype == "built_in":
                arg_val_enc = argval[argval.index('@')+1:argval.index('{')]
                arg_val_eq = argval[argval.index('{')+1:-1]
                open_circ_braces = 0
                last_open_meth = None
                for arg_meth_call in arg_val_enc.split('.'):
                    self.append_code(arg_meth_call+' ( ')
                    open_circ_braces = open_circ_braces + 1
                    last_open_meth = arg_meth_call
                meth_builtins = bultins.fetch_builtins()
                if meth_builtins[last_open_meth]["args"][0]["value"] in self.cc_data_types[1:]:
                    self.append_code(arg_val_eq)
                else:
                    self.append_code("\""+arg_val_eq+"\"")
                for circ_braces in range(0,open_circ_braces):
                    self.append_code(' ) ')
            else:
                argtype = arginfo["type"].strip().split(" ")[0]
                arg_val_eq = argval.split('@')[1]
                if argtype in self.cc_data_types[1:]:
                    self.append_code(arg_val_eq)
                else:
                    self.append_code("\""+arg_val_eq+"\"")
            
            if arg_index < arg_len-1:
                self.append_code(", ")
        
        self.append_code(" ) "+self.END_CODE)
    
    def is_ns3class_component(self,component):
        if not ( self.is_variable_components(component) or self.is_method_call(component) ):
            return True
        return False
    
    def is_variable_components(self,component):
        if component["model_type"] == "builtin__elements":
            if component["model"] == "data_type":
                return True
        
        return False

    def  is_method_call(self,component):
        if component["model_type"] == "method_call":
            if "classvar" in component and "method" in component and "args" in component:
                return True
        return False

    def append_code(self,code):
        self.py_code = self.py_code + code
    
    def break_line(self):
        self.append_code('\n')
    