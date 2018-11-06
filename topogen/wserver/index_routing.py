from flask import Blueprint, render_template
from config import config
import os

index = Blueprint('index',__name__,template_folder = config.WEB_FOLDER)

@index.route('/')
def home():
    return render_template("index.html")

