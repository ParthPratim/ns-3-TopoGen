from flask import Blueprint , render_template , request
from config import globalvars
from nst import gennst
import json

genx = Blueprint('generator',__name__)

@genx.route('/nst',methods=['POST'])
def gen_nst():
    minfo =  json.loads(request.form["topo_info"])
    nst_data = gennst.generateNST(minfo["mname"],minfo["mauthor"],minfo["mcomponents"])
    return nst_data
