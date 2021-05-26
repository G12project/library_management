from flask import Blueprint
from routes.db import mysql

lib=Blueprint('lib', __name__)
@lib.route('/libhome/', methods=['GET', 'POST'])
def libhome():
    return 'Done', 201
    