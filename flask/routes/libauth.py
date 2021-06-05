from flask import Blueprint, render_template, request, redirect, url_for, json, jsonify, session, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from .db import mysql

libauth=Blueprint('libauth', __name__)


@libauth.route('/libregistration/', methods=['POST'])
def libreg():
    if request.method == "POST":
        form =request.get_json()
        hashed_password = generate_password_hash(form['password'], method='sha256')
        username=form['username']
        address=form['address']
        email = form['email']
        con=mysql.connection
        cur = con.cursor()
        cur.execute("SELECT 1 FROM librarian where email=%s",(email,))
        con.commit()
        data=cur.fetchone()
        if data:
            cur.close()
            return make_response(jsonify({'message':'Librarian Exists already'}), 404)
        cur.execute("INSERT INTO librarian(name, email, password, address) VALUES (%s,%s, %s, %s)", (username,email,hashed_password,address,))
        con.commit()
        cur.close()
        return make_response(jsonify({'message':'Librarian Added'}), 201)
    return make_response(jsonify({'message':'Error in Registration'}), 404)
@libauth.route('/liblogin', methods=['GET', 'POST'])
def liblogin():
    if request.method=="POST":
        form=request.get_json()
        email=form['email']
        con=mysql.connection
        cur = con.cursor()
        cur.execute("Select lib_id, password, name from librarian where email=%s",(email,))
        con.commit()
        lib=cur.fetchone()
        cur.close()
        if lib:
            if check_password_hash(lib[1], form['password']):
                session['logged_in']=True
                session['user_id']=lib[0]
                session['account_type'] ='lib'
                return make_response(jsonify({"logged": 'Y', "user": lib[2]}), 201)
    return make_response(jsonify({'message':'Authentication_Error'}), 404)
