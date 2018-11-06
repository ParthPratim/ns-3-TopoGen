from flask import Flask
from wserver.index_routing import index
from wserver.workspaces_routing import workspaces

app = Flask(__name__)

app.debug = True

def setup_routes():
    app.register_blueprint(index)
    app.register_blueprint(workspaces,url_prefix="/workspaces")

def init():
    setup_routes()
    app.run(port=2018)



