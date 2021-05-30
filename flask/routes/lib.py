from flask import Blueprint, current_app, render_template, request, redirect, url_for,jsonify, flash, session, make_response
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
        f=request.form
        print(f)
        isbn_no=f.get('isbn_no')
        print(isbn_no)
        title=f['title']
        author=f['author']
        yop=f['yop']
        genre=f['genre']
        copy_no=f['copy_no']
        shelf_id=f['shelf_id']
        rat=0
        file = request.files.get('image')
        ext=file.filename.split('.')[1]
        filename = secure_filename(isbn_no+'.'+ext)
        con=mysql.connection
        cur=con.cursor()
        cur.execute("INSERT IGNORE INTO books(isbn_no, title, author, year_of_publication, genre, avg_rating, location) values(%s,%s,%s,%s,%s,%s,%s)",((isbn_no), title, author, int(yop), genre, int(rat),filename))
        con.commit()
        status='on_shelf'
        cur.execute("INSERT IGNORE INTO book_copies(isbn_no, copy_no, current_status, shelf_id) values(%s,%s,%s,%s)",((isbn_no),int(copy_no), status, int(shelf_id)))
        con.commit()
        cur.close()
        print("In DB")
        UPLOAD_FOLDER = os.path.join(current_app.root_path, 'static/images')
        print("OK")
        file.save(os.path.join(UPLOAD_FOLDER, filename))
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