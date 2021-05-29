from flask import Blueprint, render_template, request, redirect, url_for, json, jsonify, session, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from .db import mysql

libauth=Blueprint('libauth', __name__)


@libauth.route('/libregistration/', methods=['GET', 'POST'])
def libreg():
    if request.method == "POST":
        form = libRegisterForm(request.form)
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        username=form.username.data
        address=form.address.data
        email = form.email.data
        con=mysql.connection
        cur = con.cursor()
        cur.execute("INSERT INTO librarian(name, email, password, address) VALUES (%s,%s, %s %s)", (username,email,hashed_password,address,))
        con.commit()
        cur.close()
        flash('Thank You for registering')
        return redirect(url_for('libhome'))
    form=libRegisterForm()
    return render_template('addlibrarian.html',form=form)
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
