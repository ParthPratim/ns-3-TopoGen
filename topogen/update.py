import os
import string
import importlib
import subprocess
from inspect import getmembers, isclass, isfunction, isroutine
from io import StringIO
import yaml
import shutil

def remove_classes_with_a_helper(classes,helpers):
    lis = []
    for class_name in classes:
        if not class_name+"Helper" in helpers:
            lis.append(class_name)

    return  lis

def prepare_classes(module,classes):
    struct = {}
    for class_name in classes:
        init_dec = generate_init_dec(module,class_name)
        init_dec.update(list_functions(module,class_name))
        struct[class_name] = init_dec
    return struct

def  list_functions(module,class_name):
    fdict = {}
    for fname in getmembers(getattr(module,class_name),isroutine):
        if fname[0].find('__',0) == -1:
            fdict[fname[0]] = {"args":generate_usage_params(fname[1].__doc__)}
    return fdict

def generate_usage_params(doc):
    params = []
    if not doc is None:
        segments = doc.split('\n')[2:]
        for segment in segments:
            gap1 = segment.find(' ',0)
            if segment[0:gap1] == "type:":
                gap2 = segment.find(' ',gap1+1)
                pname = segment[gap1+1:gap2-1]
                ptype = segment[gap2+1:]
                params.append({pname:ptype})
    return params

def generate_init_dec(module,classname):
    docs = getattr(module,classname).__doc__
    decs = docs.split('\n')
    pdict = {"__init__":{"args":[]}}
    for dec in decs:
        params = [var.strip() for var in dec[len(classname)+1:-1].split(',')]
        if params[0] == "arg0" :
            continue
        else:
            pdict["__init__"]["args"].append(params)
    return pdict

def dump_module_data(modulemap):
    # DELETE ALL MODELS (if any)
    MODELS_DIR = 'models'
    models = os.listdir(MODELS_DIR)
    for model in models:
        path = os.path.join(MODELS_DIR,model)
        if os.path.isdir(path):
            shutil.rmtree(path)

    for model,class_name in modulemap.iteritems():
        path = os.path.join(MODELS_DIR,model)
        os.mkdir(path)
        for cl_name , functions in class_name.iteritems():
            class_conf = open(os.path.join(path,cl_name+'.conf'),'w')
            yaml.dump(functions,stream=class_conf,default_flow_style=False)
            class_conf.close()
    
if __name__ == "__main__":
    NS3_ROOT = '/home/devman/ns-3-29-078dcf663058'
    src = os.path.join(NS3_ROOT,"src")
    models = os.listdir(src)
    modulemap = {}
    for model in models:
        path = os.path.join(src,model)
        classes = []
        helpers = []
        try:
            model = model.replace('-','_')
            module = importlib.import_module('ns.'+model)
            modulemap[model] = []
            for element in getmembers(module):
                if isclass(element[1]):
                    if element[0].find('__',0) == -1:
                        classes.append(element[0])
                        if element[0][len(element[0])-len("Helper"):] == "Helper":
                            helpers.append(element[0])

            classes_to_use = remove_classes_with_a_helper(classes,helpers)
            modulemap[model] = prepare_classes(module,classes_to_use)
            del module
        except Exception as exception:
            print("Failed to import : "+exception.__class__.__name__)
    module = importlib.import_module("ns3")
    for element in getmembers(module):
        if isroutine(element[1]):
            ftype = element[1].__class__.__name__
            if ftype == "builtin_function_or_method" and element[0].find('__',0) == -1:
                doc = element[1].__doc__
                module = element[1].__module__
                if module[:3] == "ns.":
                        module = module[3:]
                        if not module in modulemap:
                            modulemap[module] = {}
                params = []
                if not doc is None:
                    params = generate_usage_params(doc)
                if "builtin_functions_or_methods" in modulemap[module]:
                    modulemap[module]["builtin_functions_or_methods"].update({element[0]:{"args":params}})
                else:
                    modulemap[module]["builtin_functions_or_methods"] = {element[0]:{"args":params}}
                     
    dump_module_data(modulemap)
