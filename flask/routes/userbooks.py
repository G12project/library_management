from flask import Blueprint
from routes.db import mysql
from flask import render_template, request, redirect, url_for, json, jsonify, flash, session, make_response

userbooks=Blueprint('userbooks', __name__)

#hold------###
@userbooks.route('/homedata/hold/<isbn>', methods=['GET'])
def on_hold(isbn):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT 1 FROM book_copies WHERE isbn_no=%s AND user_id=%s", (int(isbn), int(session['user_id']),))
	con.commit()
	data=cur.fetchone()
	cur.close()
	if data!=None:
		return make_response(jsonify({'message':'Already_Requested'}), 201)
	status='on_shelf'
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT copy_no FROM book_copies WHERE isbn_no=%s AND current_status=%s", (int(isbn), status,))
	con.commit()
	data=cur.fetchone()
	cur.close()
	if data:
		status='on_hold'
		today=datetime.today().strftime('%Y-%m-%d')
		cur.execute("UPDATE book_copies SET current_status=%s WHERE copy_no=%s AND isbn_no=%s", (status, int(data[0]), int(isbn),))
		con.commit()
		cur.execute("INSERT IGNORE INTO on_hold(user_id, isbn_no, copy_no, hold_begins) values(%s,%s,%s,%s)", (session['user_id'], int(isbn), int(data[0]),today,))
		con.commit()
		return make_response(jsonify({'message':'Request Successful'}), 201)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("INSERT IGNORE INTO on_hold(user_id, isbn_no) values(%s,%s)",(session['user_id'],int(isbn),))
	con.commit()
	cur.close()
	return make_response(jsonify({'message':'We will hold the book for you once available'}), 201)

#holdList------###
@userbooks.route('/homedata/onhold', methods=['GET', 'POST'])
def hold_list():
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT on_hold.isbn_no, books.title, books.author, on_hold.hold_begins FROM on_hold, books where on_hold.user_id=%s AND on_hold.isbn_no=books.isbn_no AND on_hold.hold_begins is not null",(int(session['user_id']),))
	con.commit()
	data=cur.fetchall()
	cur.close()
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT on_hold.isbn_no, books.title, books.author FROM on_hold, books where on_hold.user_id=%s AND on_hold.isbn_no=books.isbn_no AND on_hold.hold_begins is null",(int(session['user_id']),))
	con.commit()
	data1=cur.fetchall()
	cur.close()
	hold=[]
	for d in data:
		hold.append({'isbn_no':d[0], 'title':d[1], 'author':d[2], 'begin':d[3]})
	requested=[]
	for d in data1:
		requested.append({'isbn_no':d[0], 'title':d[1], 'author':d[2]})
	return jsonify({'hold': hold,
	'requested': requested})

#loan----####
@userbooks.route('/homedata/loan/<isbn>', methods=['GET'])
def on_loan(isbn):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	status='on_shelf'
	con=mysql.connection
	cur=con.cursor()
	print(isbn)
	cur.execute("SELECT fines, designation from user where user_id=%s",(session['user_id'],))
	con.commit()
	fine=cur.fetchone()
	cur.close()
	if fine[0]>1000:
		print('Too much debt')
		return make_response(jsonify({'message':'Too much debt'}), 201)
	con=mysql.connection
	cur=con.cursor()
	cur.execute("SELECT COUNT(*) from book_copies where user_id=%s",(session['user_id'],))
	con.commit()
	count=cur.fetchone()
	cur.close()
	if count[0]>3 and fine[1]=='student':
		print('Too many books')
		return make_response(jsonify({'message':'Too many books'}), 201)
	con=mysql.connection
	cur=con.cursor()
	cur.execute("SELECT copy_no, isbn_no FROM book_copies WHERE isbn_no=%s AND current_status=%s", (int(isbn), status,))
	con.commit()
	data=cur.fetchone()
	cur.close()
	if data:
		status='on_loan'
		con=mysql.connection
		cur=con.cursor()
		cur.execute("UPDATE book_copies SET current_status=%s, user_id=%s WHERE isbn_no=%s AND copy_no=%s",(status, int(session['user_id']),int(isbn), int(data[0]),))
		con.commit()
		cur.close()
		return make_response(jsonify({'message':'Successfully Borrowed'}), 201)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT copy_no FROM on_hold WHERE isbn_no=%s AND user_id=%s",(int(isbn), int(session['user_id']),))
	con.commit()
	data=cur.fetchone()
	cur.close()
	print(data)
	if data!=None and data[0]!=None:
		status='on_loan'
		con=mysql.connection
		cur=con.cursor()
		cur.execute("UPDATE book_copies SET current_status=%s, user_id=%s WHERE isbn_no=%s AND copy_no=%s"(status, int(session['user_id']),int(isbn), int(data[0]),))
		con.commit()
		cur.execute("DELETE FROM on_hold where user_id=%s AND isbn_no=%s",(int(session['user_id']),int(isbn),))
		con.commit()
		cur.close()
		return make_response(jsonify({'message':'Successfully Borrowed'}), 201)
	return make_response(jsonify({'message':'Book Not Available Currently'}), 201)

#loan-list-----###
@userbooks.route('/homedata/loans', methods=['GET'])
def borrowed_list():
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT book_copies.isbn_no, books.title, books.author, book_copies.issued_date, book_copies.due_date FROM book_copies, books where book_copies.user_id=%s AND book_copies.isbn_no=books.isbn_no",(int(session['user_id']),))
	con.commit()
	data=cur.fetchall()
	cur.execute("SELECT fines FROM user where user_id=%s",(int(session['user_id']),))
	con.commit()
	fines=cur.fetchone()
	cur.close()
	loans=[]
	for d in data:
		loans.append({'isbn_no':d[0], 'title':d[1], 'author':d[2], 'issued_date':d[3], 'due_date': d[4]})
	return jsonify({'loans': loans, 'charges': fines[0]})
#add-to-shelf----###
@userbooks.route('/homedata/shelf/add/<isbn>', methods=['GET'])
def add(isbn):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("INSERT IGNORE INTO personal_shelf (user_id, isbn_no) values(%s, %s)",(int(session['user_id']), int(isbn),))
	con.commit()
	cur.close()
	return make_response(jsonify({'message':'Successfully Added'}), 201)

#shelf----###
@userbooks.route('/homedata/shelf', methods=['GET', 'POST'])
def personal_shelf_list():
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT personal_shelf.isbn_no, books.title, books.author, books.genre FROM personal_shelf, books where personal_shelf.user_id=%s AND personal_shelf.isbn_no=books.isbn_no",(int(session['user_id']),))
	con.commit()
	data=cur.fetchall()
	cur.close()
	shelf=[]
	for d in data:
		shelf.append({'isbn_no':d[0], 'title':d[1], 'author':d[2], 'genre':d[3]})
	return jsonify({'shelf': shelf})