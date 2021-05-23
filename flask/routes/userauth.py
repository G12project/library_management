from flask import Blueprint, render_template, request, redirect, url_for, json, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from .db import mysql
from flask_mysqldb import MySQL

userauth=Blueprint('userauth', __name__)

@userauth.route('/register/', methods=['POST'])
def register():
    if request.method == "POST":
        form =request.get_json()
        hashed_password = generate_password_hash(form['password'], method='sha256')
        username=form['username']
        address=form['address']
        faculty=form['faculty']
        email = form['email']
        desig='student'
        if faculty:
            desig='faculty'
        fines=0
        con=connection()
        cur = con.cursor()
        cur.execute("INSERT INTO user(name, email, password, address, fines, designation) VALUES (%s, %s, %s, %s, %s, %s)", (username,email,hashed_password,address,fines,desig,))
        con.commit()
        cur.close()
        return 'Done', 201

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
        cur.execute("Select user_id, password from user where email=%s",(email,))
        con.commit()
        user=cur.fetchone()
        cur.close()
        print("OKAY")
        if user:
            if check_password_hash(user[1], form['password']):
                return jsonify({"logged": "yes"})
        return jsonify({"logged": "no"})