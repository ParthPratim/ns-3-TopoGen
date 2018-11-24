from flask import Blueprint , render_template
from workspace import manager
from config import globalvars
from models import modelsmap
import json

topocreator = Blueprint('topocreator',__name__)

@topocreator.route('/')
def home():
    return render_template("topocreator/index.html")

@topocreator.route('/fetch-model-maps')
def fetch_model_maps():
    model_class_map = modelsmap.generate_map_withclasses()
    return json.dumps(model_class_map)