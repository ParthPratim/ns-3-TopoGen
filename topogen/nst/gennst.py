from models import modelsmap
from nst import gencc
from nst import nsttopy
import datetime

# NST = (N)S-3 (S)IMULATION (T)OPOLOGY 
def generateNST(mname,mauthor,mcomponents):
    nst = {}
    nst["name"] = mname
    nst["author"] = mauthor
    nst["modified"] = datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
    nst["components"] = []
    nst["dependencies"] = {"cpp" : [] , "py" : []}
    model_class_map = modelsmap.generate_map_withclasses()
    for component in mcomponents:
        model_type = component["model_type"]
        if model_type == "method_call":
            if "classvar" in component and "args" in component and "method" in component:
                nst["components"].append(component)
        else :
            if "model_type" in component and "varname" in component and "type" in component  :
                nst["components"].append(component)
                model_type = component["model"]
                if model_type != "data_type":
                    for mclass_type ,mclass_models  in model_class_map.items():
                        for model in mclass_models:
                            conf = model["__Model__Configuration__"]
                            if conf["model"] ==  model_type:
                                for dependency in conf["dependencies"]["cpp"]:
                                    if dependency not in nst["dependencies"]["cpp"]:
                                        nst["dependencies"]["cpp"].append(dependency)
                                for dependency in conf["dependencies"]["py"]:
                                    if dependency not in nst["dependencies"]["py"]:
                                        nst["dependencies"]["py"].append(dependency)
    
    pygen = nsttopy.PYcode("first.py")
    pygen.generate_code(nst)
    return pygen.get_generated_code()
    # retun nst
            

            