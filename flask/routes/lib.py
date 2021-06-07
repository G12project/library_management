from flask import Blueprint, current_app, render_template, request, redirect, url_for,jsonify, flash, session, make_response
from routes.db import mysql
from werkzeug.utils import secure_filename
import os

lib=Blueprint('lib', __name__)

@lib.route('/delcopy',methods=['POST'])
def deletecopy():
    if not session.get('logged_in'):
        return make_response(jsonify({'message':'Authentication_Error'}), 404)
    if request.method=="POST":
        form=request.get_json()
        isbn_no=form['isbn_no']
        copy_no=form['copy_no']
        con=mysql.connection
        cur=con.cursor()
        cur.execute("DELETE from book_copies where isbn_no=%s and copy_no=%s",((isbn_no), int(copy_no),))
        con.commit()
        cur.close()
        return make_response(jsonify({'message':'Copy Deleted'}), 201)
    return make_response(jsonify({'message':'Error in Deleting'}), 404)

@lib.route('/delbook',methods=['POST'])
def deletebook():
    if not session.get('logged_in'):
        return make_response(jsonify({'message':'Authentication_Error'}), 404)
    if request.method=="POST":
        form=request.get_json()
        isbn_no=form['isbn_no']
        con=mysql.connection
        cur=con.cursor()
        cur.execute("DELETE from books where isbn_no=%s",((isbn_no),))
        con.commit()
        cur.close()
        return make_response(jsonify({'message':'Book Deleted'}), 201)
    return make_response(jsonify({'message':'Error in Deleting'}), 404)
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
        cur.execute("INSERT IGNORE INTO shelf(shelf_id) values(%s)",(int(shelf_id),))
        con.commit()
        cur.execute("INSERT IGNORE INTO books(isbn_no, title, author, year_of_publication, genre, avg_rating, location) values(%s,%s,%s,%s,%s,%s,%s)",((isbn_no), title, author, int(yop), genre, rat,filename))
        con.commit()
        status='on_shelf'
        cur.execute("INSERT IGNORE INTO book_copies(isbn_no, copy_no, current_status, shelf_id) values(%s,%s,%s,%s)",((isbn_no),int(copy_no), status, int(shelf_id)))
        con.commit()
        cur.close()
        print("In DB")
        UPLOAD_FOLDER = os.path.join(current_app.root_path, 'static/images')
        print("OK")
        file.save(os.path.join(UPLOAD_FOLDER, filename))
        return make_response(jsonify({'message':'Book Added'}), 201)
    return make_response(jsonify({'message':'Error in Adding'}), 404)


@lib.route('/shiftshelf',methods=['POST'])
def shelfchange():
    if not session.get('logged_in'):
        return make_response(jsonify({'message':'Authentication_Error'}), 404)
    if request.method=="POST":
        form=request.get_json()
        isbn_no=form['isbn_no']
        copy_no=form['copy_no']
        newshelf_id=form['shelf_id']
        con=mysql.connection
        cur=con.cursor()
        cur.execute("INSERT IGNORE INTO shelf(shelf_id) values(%s)",(int(newshelf_id),))
        con.commit()
        cur.execute("UPDATE book_copies set shelf_id=%s where isbn_no=%s and copy_no=%s",(int(newshelf_id),(isbn_no), int(copy_no),))
        con.commit()
        cur.close()
        return make_response(jsonify({'message':'Shelf Shifted'}), 201)

@lib.route('/borrow',methods=['GET'])
def borrowed():
    if not session.get('logged_in'):
        return make_response(jsonify({'message':'Authentication_Error'}), 404)
    con=mysql.connection
    cur = con.cursor()
    status='on_loan'
    cur.execute("SELECT book_copies.isbn_no, books.title, book_copies.issued_date, book_copies.due_date, user.name, user.fines, book_copies.copy_no FROM book_copies, books, user where book_copies.current_status=%s and book_copies.isbn_no=books.isbn_no AND book_copies.user_id=user.user_id",(status,))
    con.commit()
    data=cur.fetchall()
    cur.close()
    loans=[]
    for d in data:
        loans.append({'isbn_no':d[0], 'title':d[1], 'issued_date':d[2], 'due_date': d[3], 'user':d[4],'fines' : d[5], 'copy_no': d[6]})
    return jsonify({'loans': loans})

@lib.route('/homedata/return/<isbn>/<copy>', methods=['GET', 'POST'])
def _return(isbn, copy):
    if not session.get('logged_in'):
         return make_response(jsonify({'message':'Authentication_Error'}), 404)
    status='on_shelf'
    con=mysql.connection
    use=0
    cur = con.cursor()
    cur.execute("UPDATE book_copies SET user_id=%s, current_status=%s WHERE isbn_no=%s AND copy_no=%s",(int(use), status,(isbn),int(copy),))
    con.commit()
    cur.close()
    return make_response(jsonify({'message':'Book Returned'}), 201)
