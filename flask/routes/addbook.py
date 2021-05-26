from flask import Blueprint, render_template, request, redirect, url_for,jsonify, flash, session, make_response
from flask import Blueprint
from routes.db import mysql


addbook=Blueprint('addbook', __name__)
@addbook.route('/addbooks/',methods=['GET', 'POST'])
def addbook1():
    if not session.get('logged_in'):
        return make_response(jsonify({'message':'Authentication_Error'}), 404)
    if request.method=="POST":
        form=request.get_json()
        isbn_no=form['isbn_no']
        title=form['title']
        author=form['author']
        yop=form['yop']
        genre=form['genre']
        copy_no=form['copy_no']
        shelf_id=form['shelf_id']
        print(isbn_no, title)
        con=mysql.connection
        cur=con.cursor()
        cur.execute("INSERT INTO books(isbn_no, title, author, year_of_publication, genre) values(%s,%s,%s,%s,%s)",(int(isbn_no), title, author, int(yop), genre,))
        con.commit()
        status='on_shelf'
        cur.execute("INSERT INTO book_copies(isbn_no, copy_no, current_status, shelf_id) values(%s,%s,%s,%s)",(int(isbn_no),int(copy_no), status, int(shelf_id)))
        con.commit()
        cur.close()
        flash('books been inserted')
        return redirect(url_for('libhome'))
    form=addbook()
    return render_template('addbook.html',form=form)