import os
import json
from config import config

def generate_map_withclasses():
    models_dir = config.MODELS_DIR
    dirs = os.listdir(models_dir)
    model_map = {}
    for model in dirs:
        full_path = os.path.join(models_dir,model)
        if os.path.isdir(full_path):
            model_map[model] = []
            classes = [class_name for class_name in os.listdir(full_path) if class_name[len(class_name)-5:] == '.conf']
            for class_name in classes:
                with open(os.path.join(full_path,class_name)) as conf_file:
                    conf_data = json.load(conf_file)
                    model_map[model].append(conf_data)
    
    return model_map