from flask import Blueprint
from routes.db import mysql
from flask import render_template, request, redirect, url_for, json, jsonify, flash, session, make_response

usersocial=Blueprint('usersocial', __name__)

#find-users----###
@usersocial.route('/homedata/users', methods=['GET'])
def search_users():
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	if request.method == "GET":
		con=mysql.connection
		cur = con.cursor()
		cur.execute("Select user_id, name FROM user")
		con.commit()
		data=cur.fetchall()
		cur.execute("Select user_id, count(*) from reviews group by(user_id)")
		con.commit()
		rev=cur.fetchall()
		cur.execute("Select user_id, count(*) from friend_list group by(user_id)")
		con.commit()
		friends=cur.fetchall()
		cur.execute("Select user_id, count(*) from personal_shelf group by(user_id)")
		con.commit()
		shelf=cur.fetchall()
		cur.close()
		users=[]
		revcount={}
		friendscount={}
		shelfcount={}
		for d in data:
			users.append({'user_id':d[0], 'name':d[1]})
		for r in rev:
			revcount[r[0]]=r[1]
		for f in friends:
			friendscount[f[0]]=f[1]
		for s in shelf:
			shelfcount[s[0]]=s[1]
		print(revcount)
		return jsonify({'users': users, 'revcount': revcount, 'friendscount': friendscount, 'shelfcount':shelfcount})

@usersocial.route('/homedata/friend/<user_id>', methods=['GET'])
def add_friend(user_id):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("INSERT IGNORE INTO friend_list(user_id, user_id1) values(%s, %s)",(int(session['user_id']), int(user_id),))
	con.commit()
	cur.close()
	return make_response(jsonify({'message':'Successfully Added'}), 201)

@usersocial.route('/homedata/friend/remove/<user_id>', methods=['GET'])
def remove_friend(user_id):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("DELETE FROM friend_list where user_id=%s AND user_id1=%s",(int(session['user_id']), int(user_id),))
	con.commit()
	cur.close()
	return make_response(jsonify({'message':'Successfully Removed'}), 201)

@usersocial.route('/homedata/friends', methods=['GET', 'POST'])
def friend_list():
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT friend_list.user_id1, user.name FROM friend_list, user where friend_list.user_id1=user.user_id AND friend_list.user_id=%s",(int(session['user_id']),))
	con.commit()
	data=cur.fetchall()
	cur.close()
	friends=[]
	for d in data:
		friends.append({'user_id':d[0], 'name':d[1]})
	return jsonify({'friends': friends})

@usersocial.route('/homedata/user/shelf/<user_id>', methods=['GET', 'POST'])
def book_shelf(user_id):
	if not session.get('logged_in'):
		return make_response(jsonify({'message':'Authentication_Error'}), 404)
	con=mysql.connection
	cur = con.cursor()
	cur.execute("SELECT personal_shelf.isbn_no, books.title, books.author, books.genre, books.location FROM personal_shelf, books where personal_shelf.user_id=%s AND personal_shelf.isbn_no=books.isbn_no",(int(user_id),))
	con.commit()
	data=cur.fetchall()
	cur.close()
	friend_shelf=[]
	for d in data:
		friend_shelf.append({'isbn_no':d[0], 'title':d[1], 'author': d[2] , 'genre': d[3], 'image': d[4]})
	return jsonify({'friend_shelf': friend_shelf})