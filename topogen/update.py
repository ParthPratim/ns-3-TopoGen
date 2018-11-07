import os
import string
import importlib
import subprocess
from inspect import getmembers, isclass, isfunction, isroutine
from io import StringIO

def remove_classes_with_a_helper(classes,helpers):
    i = 0
    for class_name in classes:
        if class_name+"Helper" in helpers:
            del classes[i]
        else:
            i = i + 1

def prepare_classes(module,classes):
    struct = {}
    for class_name in classes:
        struct[class_name] = list_functions(module,class_name)
    return struct

def  list_functions(module,class_name):
    return [(fname[0],generate_usage_params(fname[1].__doc__)) for fname in getmembers(getattr(module,class_name),isroutine) if fname[0].find('__',0) == -1]

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
            modulemap['ns.'+model] = []
            for element in getmembers(module):
                if isclass(element[1]):
                    if element[0].find('__',0) == -1:
                        classes.append(element[0])
                        if element[0][len(element[0])-len("Helper"):] == "Helper":
                            helpers.append(element[0])

            remove_classes_with_a_helper(classes,helpers)
            modulemap['ns.'+model] = prepare_classes(module,classes)
            del module
        except Exception as exception:
            print("Failed to import : "+exception.__class__.__name__)
    
    print(modulemap["ns.internet"])
        
    