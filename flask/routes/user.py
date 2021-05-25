from flask import Blueprint
from routes.db import mysql
from flask import render_template, request, redirect, url_for, json, jsonify, flash, session

user=Blueprint('user', __name__)

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
# @user.route('/home/review/<isbn>', methods=['POST'])
# def add_review(isbn):
# 	if not session.get('logged_in'):
# 		return 'Authentication_Error', 404
# 	form=ReviewForm(request.form)
# 	if request.method == "POST":
# 		form=request.get_json()
# 		rat=form['rating']
# 		review=None
# 		if len(form['review']):
# 			review=form['review']
# 		print(review)
# 		con=mysql.connection
# 		cur = con.cursor()
# 		cur.execute("INSERT IGNORE INTO reviews (user_id, isbn_no, rating, review) values(%s, %s, %s, %s)",(int(session['user_id']), int(isbn),int(rat), review,))
# 		con.commit()
# 		cur.execute(" UPDATE books set avg_rating=(Select avg(rating) from reviews where isbn_no=books.isbn_no group by(isbn_no))")
# 		con.commit()
# 		cur.close()
# 		return 'Done', 201


