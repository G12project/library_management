from flask import Blueprint, render_template, request, redirect, url_for,jsonify, flash, session, make_response
from routes.db import mysql
from werkzeug.utils import secure_filename
import os

lib=Blueprint('lib', __name__)

@lib.route('/deletebooks/',methods=['GET', 'POST'])
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

@lib.route('/addbooks',methods=['GET', 'POST'])
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
        print("In DB")
        UPLOAD_FOLDER = '/static/images'
        target=os.path.join(UPLOAD_FOLDER,'test')
        file = request.files.get('image')
        print(file)
        print("OK")
        filename = secure_filename(isbn_no)
        print("OK")
        destination="/".join([target, filename])
        file.save(destination)
        return make_response(jsonify({'message':'Done'}), 201)
    return make_response(jsonify({'message':'Error in Adding'}), 404)


@lib.route('/deletebooks/',methods=['GET', 'POST'])
def shelfchange():
    if not session.get('logged_in'):
        return make_response(jsonify({'message':'Authentication_Error'}), 404)
    if request.method=="POST":
        form=request.get_json()
        isbn_no=form['isbn_no']
        copy_no=form['copy_no']
        newshelf_id=form['newshelf_id']
        con=mysql.connection
        cur=con.cursor()
        cur.execute("select shelf_id from book_copies where isbn_no=%s and copy_no=%s",(int(isbn_no),int(copy_no),))
        con.commit()
        oldshelf_id=cur.fetchone()

        cur.execute("UPDATE shelf set capacity=capacity+1 where shelf_id=%s",(int(oldshelf_id[0]),))
        con.commit()
        cur.execute("UPDATE book_copies set shelf_id=%s where isbn_no=%s and copy_no=%s",(int(newshelf_id),int(isbn_no), int(copy_no),))
        con.commit()
        cur.execute("UPDATE shelf set capacity=capacity-1 where shelf_id=%s",(int(newshelf_id),))
        con.commit()
        cur.close()
        flash('changes had been done')
        return redirect(url_for('libhome'))
    form=shiftshelf()
    return render_template('shiftshelf.html',form=form)