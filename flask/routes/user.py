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
		cur.execute("SELECT isbn_no, title, author, location, avg_rating, genre from books")
		con.commit()
		data=cur.fetchall()
		for d in data:
			res.append({'isbn_no': d[0],'title': d[1], 'author': d[2], 'image': d[3], 'rating': str(d[4]), 'genre': d[5]})
		cur.close()
	else:
		form=request.get_json()
		book=form['search']
		# search by author or book
		con=mysql.connection
		cur=con.cursor()
		cur.execute("SELECT isbn_no, title, author,location, avg_rating, genre from books WHERE title LIKE %s OR author LIKE %s", (book+"%", "%"+book+"%",))
		con.commit()
		data=cur.fetchall()
		for d in data:
			res.append({'isbn_no': d[0],'title': d[1], 'author': d[2], 'image': d[3], 'rating': str(d[4]), 'genre': d[5]})
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
		cur.execute("select isbn_no, title, author, genre, avg_rating, location from books where genre in(select genre from books where isbn_no in(select isbn_no from reviews where rating>2 and user_id=%s))", (int(session['user_id']),))
		data=cur.fetchall()
		con.commit()
		for d in data:
			data1.append({'isbn_no': d[0], 'title': d[1], 'author': d[2], 'genre': d[3], 'rating': str(d[4]), 'image': d[5]})
		cur.close()
	print(json.dumps({'data': data1}))
	return jsonify({'books':data1})

#book-detail-----###
@user.route('/homedata/<isbn>', methods=['GET', 'POST'])
def book_detail(isbn):
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT * FROM books where isbn_no=%s", ((isbn),))
	con.commit()
	data=cur.fetchone()
	cur.close()
	con=mysql.connection
	cur=con.cursor()
	cur.execute("SELECT user.name, reviews.rating, reviews.review FROM user, reviews where isbn_no=%s AND user.user_id=reviews.user_id", ((isbn),))
	con.commit()
	data1=cur.fetchall()
	pers=None
	if session.get('user_id'):
		cur.execute("SELECT 1 from personal_shelf where user_id=%s and isbn_no=%s",(int(session['user_id']), (isbn),))
		con.commit()
		pers=cur.fetchall()
	cur.close()
	sh=0
	if pers:
		sh=1
	bookdetail={'isbn_no': data[0],'title': data[1], 'author':data[2] , 'year_of_pub':data[3] , 'genre': data[4], 'rating': str(data[5]), 'image': data[6], 'shelf': sh}
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
		cur.execute("INSERT INTO reviews (user_id, isbn_no, rating, review) values(%s, %s, %s, %s) ON DUPLICATE KEY UPDATE rating=values(rating), review=values(review)",(int(session['user_id']), (isbn),int(rat), review,))
		con.commit()
		cur.execute(" UPDATE books set avg_rating=(Select avg(rating) from reviews where isbn_no=%s) where isbn_no=%s", (isbn,isbn,))
		con.commit()
		cur.close()
		return make_response(jsonify({'message':'Done'}), 201)
@user.route('/homedata/reviews', methods=['GET'])
def review_list():
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT reviews.isbn_no, books.title, books.author, reviews.rating, reviews.review FROM reviews, books where reviews.user_id=%s AND reviews.isbn_no=books.isbn_no",(int(session['user_id']),))
	con.commit()
	data=cur.fetchall()
	cur.close()
	reviews=[]
	for d in data:
		reviews.append({'isbn_no':d[0], 'title':d[1], 'author':d[2], 'rating':d[3], 'review': d[4]})
	return jsonify({'reviews': reviews})