from flask import Blueprint, render_template, request, redirect, url_for,jsonify, flash, session, make_response
from routes.db import mysql

deletebook=Blueprint('deletebook', __name__)
@deletebook.route('/deletebooks/',methods=['GET', 'POST'])
def deletebook():
    if not session.get('logged_in'):
        return make_response(jsonify({'message':'Authentication_Error'}), 404)
    if request.method=="POST":
        form=request.get_json()
        isbn_no=form['isbn_no']
        copy_no=form['copy_no']
        shelf_id=form['shelf_id']
        con=mysql.connection
        cur=con.cursor()
        cur.execute("DELETE from book_copies where isbn_no=%s and copy_no=%s",(int(isbn_no), int(copy_no),))
        con.commit()
        cur.execute("UPDATE shelf set capacity=capacity+1 where shelf_id=%s",(int(shelf_id),))
        con.commit()
        cur.close()
        flash('book have been deleted')
        return redirect(url_for('libhome'))
    form=delete()
    return render_template('deletebook.html',form=form)