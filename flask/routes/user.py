from flask import Blueprint
from routes.db import mysql
from flask import render_template, request, redirect, url_for, json, jsonify, flash, session, make_response

user=Blueprint('user', __name__)

#search------###
@user.route('/homedata/search/<allb>', methods=['GET', 'POST'])
def search(allb):
	print("OK")
	res=[]
	print(allb)
	if (int(allb))==1 and request.method=='GET':
		con=mysql.connection
		cur = con.cursor()
		cur.execute("SELECT isbn_no, title, author from books")
		con.commit()
		data=cur.fetchall()
		for d in data:
			res.append({'isbn_no': d[0],'title': d[1], 'author': d[2]})
		cur.close()
	else:
		form=request.get_json()
		book=form['search']
		# search by author or book
		con=mysql.connection
		cur=con.cursor()
		cur.execute("SELECT isbn_no, title, author from books WHERE title LIKE %s OR author LIKE %s", (book, book,))
		con.commit()
		data=cur.fetchall()
		for d in data:
			res.append({'isbn_no': d[0],'title': d[1], 'author': d[2]})
		cur.close()
	# all in the search box will return all the tuples
	return jsonify({"books": res})

#home------###
@user.route('/homedata',methods=['GET'])
def home():
	email=None
	data1=[]
	print("OKAY")
	if not session.get('logged_in') is None and session['logged_in']:
		print("OKAY")
		con=mysql.connection
		cur = con.cursor()
		cur.execute("select isbn_no, title, author, genre, avg_rating from books where genre in(select genre from books where isbn_no in(select isbn_no from reviews where rating>2 and user_id=%s))", (int(session['user_id']),))
		data=cur.fetchall()
		con.commit()
		for d in data:
			rat=0
			if d[4]:
				rat=d[4]
			data1.append({'isbn_no': d[0], 'title': d[1], 'author': d[2], 'genre': d[3], 'rating': rat})
		cur.close()
	print(json.dumps({'data': data1}))
	return jsonify({'data':data1})

#book-detail-----###
@user.route('/homedata/<isbn>', methods=['GET', 'POST'])
def book_detail(isbn):
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT * FROM books where isbn_no=%s", (int(isbn),))
	con.commit()
	data=cur.fetchone()
	cur.close()
	con=mysql.connection
	cur=con.cursor()
	cur.execute("SELECT user.name, reviews.rating, reviews.review FROM user, reviews where isbn_no=%s AND user.user_id=reviews.user_id", (int(isbn),))
	con.commit()
	data1=cur.fetchall()
	cur.close()
	bookdetail={'isbn_no': data[0],'title': data[1], 'author':data[2] , 'year_of_pub':data[3] , 'genre': data[4]}
	reviews=[]
	for d in data1:
		reviews.append({'user':d[0], 'rating':d[1] , 'review': d[2] })
	return jsonify({'bookdetail': bookdetail, 'reviews': reviews})
@user.route('/homedata/review/<isbn>', methods=['POST'])
def add_review(isbn):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	if request.method == "POST":
		form=request.get_json()
		rat=form['rating']
		review=None
		if len(form['review']):
			review=form['review']
		print(review)
		con=mysql.connection
		cur = con.cursor()
		cur.execute("INSERT INTO reviews (user_id, isbn_no, rating, review) values(%s, %s, %s, %s) ON DUPLICATE KEY UPDATE rating=values(rating), review=values(review)",(int(session['user_id']), int(isbn),int(rat), review,))
		con.commit()
		cur.execute(" UPDATE books set avg_rating=(Select avg(rating) from reviews where isbn_no=books.isbn_no group by(isbn_no))")
		con.commit()
		cur.close()
		return make_response(jsonify({'message':'Done'}), 201)
#hold------###
@user.route('/homedata/hold/<isbn>', methods=['GET'])
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
@user.route('/homedata/on_hold', methods=['GET', 'POST'])
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

@user.route('/homedata/loan/<isbn>', methods=['GET'])
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

@user.route('/homedata/shelf/add/<isbn>', methods=['GET'])
def add(isbn):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 201)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("INSERT IGNORE INTO personal_shelf (user_id, isbn_no) values(%s, %s)",(int(session['user_id']), int(isbn),))
	con.commit()
	cur.close()
	return make_response(jsonify({'message':'Successfully Added'}), 201)

