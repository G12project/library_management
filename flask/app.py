from flask import Flask
from routes.userauth import userauth
from routes.user import user
from routes.db import mysql
from routes.userbooks import userbooks
from routes.usersocial import usersocial
from routes.libauth import libauth
from routes.lib import lib
from flask_cors import CORS
from datetime import datetime
from flask import render_template, request, redirect, url_for, json, jsonify, flash, session
from wtforms import Form, BooleanField, StringField, PasswordField, SubmitField ,validators, TextAreaField, IntegerField
from wtforms.validators import DataRequired
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from flask_mysqldb import MySQL
app = Flask(__name__)
cors = CORS(app)

app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.config["SESSION_COOKIE_PATH"]='/'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'testt'

UPLOAD_FOLDER = '/static/images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

mysql.init_app(app)

app.register_blueprint(userauth)
app.register_blueprint(user)
app.register_blueprint(userbooks)
app.register_blueprint(usersocial)
app.register_blueprint(libauth)
app.register_blueprint(lib)


if __name__ == '__main__':
    app.run(debug=True)