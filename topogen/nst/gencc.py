from config import bultins

class CCcode:
    cc_code = ""
    cc_data_types = ["std::string","int","double","bool"]
    code_components = {}
    END_CODE = ";"
    def __init__(self,cc_filename):
        self.add_gnu_emac_header_comment()
        self.add_license()
    
    def generate_code(self,components):
        self.code_components = components
        self.add_gnu_emac_header_comment()
        self.add_license()
        self.add_headers()
        self.use_namespace("ns3")
        self.add_main()
        self.add_open_brackets()
        for component in components["components"]:
            if self.is_variable_components(component):
                self.define_variable(component)
            elif self.is_method_call(component):
                self.call_method(component)
            else:
                self.create_class_object(component)

        self.set_return_val(0)
        self.add_close_brackets()
    
    def get_generated_code(self):
        return self.cc_code

    def add_gnu_emac_header_comment(self):
        header = '/* -*- Mode:C++; c-file-style:"gnu"; indent-tabs-mode:nil; -*- */'
        self.break_line()
        self.append_code(header)

    def add_license(self):
        license = '/* \n \
        * This program is free software; you can redistribute it and/or modify \n \
        * it under the terms of the GNU General Public License version 2 as \n \
        * published by the Free Software Foundation; \n \
        * \n \
        * This program is distributed in the hope that it will be useful, \n \
        * but WITHOUT ANY WARRANTY; without even the implied warranty of \n \
        * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the \n \
        * GNU General Public License for more details. \n \
        * \n \
        * You should have received a copy of the GNU General Public License \n \
        * along with this program; if not, write to the Free Software \n \
        * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA \n \
        */'
        self.break_line()
        self.append_code(license)
    
    def add_main(self):
        main_def = "int main (int argc, char *argv[])"
        self.break_line()
        self.append_code(main_def)
    
    def define_variable(self,component):
        self.break_line()
        self.append_code(component["type"]+" "+component["varname"] + " ")
        if component["value"] != "":
            self.append_code(" = " + component["value"])
        
        self.append_code(self.END_CODE)
    
    def create_class_object(self,component):
        self.break_line()
        self.append_code(component["model"]+ " " +component["varname"])
        self.append_method_params(component["args"])
        
    def append_method_params(self,arglist):
        self.append_code(" ( ")
        arg_len = len(arglist.items())
        for arg_index,arg in enumerate(arglist):
            arginfo = arglist[arg]
            argval = arginfo["value"]
            arg_suptype = argval[:argval.index('@')]
            if arg_suptype == "in_scope":
                self.append_code(argval[argval.index('@')+1:])
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

    def call_method(self,component):
        self.break_line()
        self.append_code(component["classvar"]+"."+component["method"])
        self.append_method_params(component["args"])

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

    def add_headers(self):
        dependencies = self.code_components["dependencies"]
        self.add_ccheader("bits/stdc++.h")
        for dependency in dependencies:
            self.add_ns3header("ns3/"+dependency+"-module.h")
    
    def add_ccheader(self,header_file):
        self.break_line()
        self.append_code("#include <"+header_file+">")

    def add_ns3header(self,header_file):
        self.break_line()
        self.append_code("#include \""+header_file+"\"")

    def add_open_brackets(self):
        self.break_line()
        self.append_code('{')
    
    def add_close_brackets(self):
        self.break_line()
        self.append_code('}')
    
    def break_line(self):
        self.cc_code = self.cc_code + '\n'
    
    def set_return_val(self,rval):
        self.break_line()
        self.append_code("return "+str(rval)+self.END_CODE)
    
    def use_namespace(self,ns):
        self.break_line()
        self.append_code("using namespace "+ns+self.END_CODE)

    def append_code(self,code):
        self.cc_code = self.cc_code + code
