from flask import Blueprint, render_template, request, redirect, url_for, json, jsonify, session, make_response
from werkzeug.security import check_password_hash, generate_password_hash
# from werkzeug.utils import secure_filename
from .db import mysql
# import os

userauth=Blueprint('userauth', __name__)

@userauth.route('/register/', methods=['POST'])
def register():
    if request.method == "POST":
        form =request.get_json()
        hashed_password = generate_password_hash(form['password'], method='sha256')
        username=form['username']
        address=form['address']
        faculty=form['is_faculty']
        email=form['email']
        desig='student'
        if faculty:
            desig='faculty'
        fines=0
        con=mysql.connection
        cur = con.cursor()
        cur.execute("INSERT INTO user(name, email, password, address, fines, designation) VALUES (%s, %s, %s, %s, %s, %s)", (username,email,hashed_password,address,fines,desig,))
        con.commit()
        cur.close()
        # UPLOAD_FOLDER = '/static/images'
        # target=os.path.join(UPLOAD_FOLDER,'test')
        # file = request.files['image']
        # filename = secure_filename(file.filename)
        # destination="/".join([target, filename])
        # file.save(destination)
        return make_response(jsonify({'message':'Done'}), 201)
    return make_response(jsonify({'message':'Error in Registration'}), 404)

@userauth.route('/login',methods=['POST'])
def login():
    print("OKAY")
    if request.method=="POST":
        print("OKAY")
        form=request.get_json()
        email = form['email']
        print(email)
        hashed_password = generate_password_hash(form['password'], method='sha256')
        con=mysql.connection
        cur=con.cursor()
        cur.execute("Select user_id, password, name from user where email=%s",(email,))
        con.commit()
        user=cur.fetchone()
        cur.close()
        print("OKAY")
        if user:
            if check_password_hash(user[1], form['password']):
                session['logged_in']=True
                session['user_id']=user[0]
                return make_response(jsonify({"logged": 'Y', "user": user[2]}), 201)
        return make_response(jsonify({'message':'Authentication_Error'}), 404)

@userauth.route('/logout')
def logout():
    session['logged_in'] = False
    session.clear()
    return make_response(jsonify({'message': 'Done'}), 201)