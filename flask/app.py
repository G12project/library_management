from flask import Flask
from routes.userauth import userauth
from routes.user import user
from routes.db import mysql
from routes.userbooks import userbooks
from routes.usersocial import usersocial
from routes.libauth import libauth
from flask_cors import CORS
from datetime import datetime
from flask import render_template, request, redirect, url_for, json, jsonify, flash, session
from wtforms import Form, BooleanField, StringField, PasswordField, SubmitField ,validators, TextAreaField, IntegerField
from wtforms.validators import DataRequired
from werkzeug.security import check_password_hash, generate_password_hash
from flask_mysqldb import MySQL
app = Flask(__name__)
cors = CORS(app)

app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"
app.config["SESSION_COOKIE_PATH"]='/'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'testt'

mysql.init_app(app)

app.register_blueprint(userauth)
app.register_blueprint(user)
app.register_blueprint(userbooks)
app.register_blueprint(usersocial)
app.register_blueprint(libauth)


# class RegisterForm(Form):
#     username=StringField("Username", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     address=StringField("Address", validators=[validators.Length(min=10, max=25), validators.DataRequired(message="Please Fill This Field")])
#     password = PasswordField("Password", validators=[validators.DataRequired(message="Please Fill This Field")])
#     email = StringField("Email", validators=[validators.Email(message="Please enter a valid email address")])
#     faculty=BooleanField("faculty")
#     submit = SubmitField('Submit')

# class LoginForm(Form):
#     email = StringField("Email", validators=[validators.Email(message="Please enter a valid email address")])
#     password = PasswordField("Password", validators=[validators.DataRequired(message="Please Fill This Field")])
#     submit = SubmitField('Submit')

# class libRegisterForm(Form):
#     username=StringField("Username", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     email = StringField("Email", validators=[validators.Email(message="Please enter a valid email address")])
#     address=StringField("Address", validators=[validators.Length(min=10, max=25), validators.DataRequired(message="Please Fill This Field")])
#     password = PasswordField("Password", validators=[validators.DataRequired(message="Please Fill This Field")])
#     submit = SubmitField('Submit')
# class addbook(Form):
#     isbn_no=IntegerField("isbn_no", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     title=StringField("title", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     author=StringField("author", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     genre=StringField("genre", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     yop=IntegerField("publication year", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     copy_no=IntegerField("Copy", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     shelf_id=IntegerField("shelf_id", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     submit = SubmitField('Submit')
# class delete(Form):
#     isbn_no=IntegerField("isbn_no", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     copy_no=IntegerField("Copy", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     shelf_id=IntegerField("shelf_id", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     submit = SubmitField('Submit')
# class shiftshelf(Form):
#     isbn_no=IntegerField("isbn_no", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     copy_no=IntegerField("No of copies", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     newshelf_id=IntegerField("newshelf_id", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
#     submit = SubmitField('Submit')

# class SearchForm(Form):
#     getall=BooleanField("See all books")
#     book= StringField("Book_Title OR Author")
#     submit = SubmitField('Submit')
# class ReviewForm(Form):
#     rating=IntegerField("1-5", validators=[validators.Length(min=1, max=5)])
#     Review= TextAreaField("Review")
#     submit = SubmitField('Submit')
# class SearchUsers(Form):
#     name= StringField("name or email")
#     submit = SubmitField('Submit')

# @app.route('/', methods=['GET'])
# def front():
#     return redirect(url_for('home'))
# @app.route('/register/', methods=['GET', 'POST'])









# @app.route('/home/return/<isbn>', methods=['GET', 'POST'])
# def _return(isbn):
#     if not session.get('logged_in'):
#         flash('Login to continue')
#         return redirect(url_for('login'))
#     bool=None
#     status='on_shelf'
#     con=mysql.connection
#     cur = con.cursor()
#     cur.execute("UPDATE book_copies SET user_id=%s AND current_status=%s WHERE isbn_no=%s AND user_id=%s",(bool,status,int(isbn),int(session['user']),))
#     con.commit()
#     cur.close()
#     return redirect(url_for('borrowed_list'))









# @app.route('/libhome/', methods=['GET', 'POST'])
# def libhome():
#     return render_template('libhome.html')

# @app.route('/addbooks/',methods=['GET', 'POST'])
# def addbook1():
#     if request.method=="POST":
#         form=addbook(request.form)
#         isbn_no=form.isbn_no.data
#         title=form.title.data
#         author=form.author.data
#         yop=form.yop.data
#         genre=form.genre.data
#         copy_no=form.copy_no.data
#         shelf_id=form.shelf_id.data
#         print(isbn_no, title)
#         con=mysql.connection
#         cur=con.cursor()
#         cur.execute("INSERT INTO books(isbn_no, title, author, year_of_publication, genre) values(%s,%s,%s,%s,%s)",(int(isbn_no), title, author, int(yop), genre,))
#         con.commit()
#         status='on_shelf'
#         cur.execute("INSERT INTO book_copies(isbn_no, copy_no, current_status, shelf_id) values(%s,%s,%s,%s)",(int(isbn_no),int(copy_no), status, int(shelf_id)))
#         con.commit()
#         cur.close()
#         flash('books been inserted')
#         return redirect(url_for('libhome'))
#     form=addbook()
#     return render_template('addbook.html',form=form)


# @app.route('/deletebooks/',methods=['GET', 'POST'])
# def deletebook():
#     if request.method=="POST":
#         form=delete(request.form)
#         isbn_no=form.isbn_no.data
#         copy_no=form.copy_no.data
#         shelf_id=form.shelf_id.data
#         con=mysql.connection
#         cur=con.cursor()
#         cur.execute("DELETE from book_copies where isbn_no=%s and copy_no=%s",(int(isbn_no), int(copy_no),))
#         con.commit()
#         cur.execute("UPDATE shelf set capacity=capacity+1 where shelf_id=%s",(int(shelf_id),))
#         con.commit()
#         cur.close()
#         flash('book have been deleted')
#         return redirect(url_for('libhome'))
#     form=delete()
#     return render_template('deletebook.html',form=form)

# @app.route('/shiftshelf/',methods=['GET', 'POST'])
# def shiftshelf1():
#     if request.method=="POST":
#         form=shiftshelf(request.form)
#         isbn_no=form.isbn_no.data
#         copy_no=form.copy_no.data
#         newshelf_id=form.newshelf_id.data
#         con=mysql.connection
#         cur=con.cursor()
#         cur.execute("select shelf_id from book_copies where isbn_no=%s and copy_no=%s",(int(isbn_no),int(copy_no),))
#         con.commit()
#         oldshelf_id=cur.fetchone()

#         cur.execute("UPDATE shelf set capacity=capacity+1 where shelf_id=%s",(int(oldshelf_id[0]),))
#         con.commit()
#         cur.execute("UPDATE book_copies set shelf_id=%s where isbn_no=%s and copy_no=%s",(int(newshelf_id),int(isbn_no), int(copy_no),))
#         con.commit()
#         cur.execute("UPDATE shelf set capacity=capacity-1 where shelf_id=%s",(int(newshelf_id),))
#         con.commit()
#         cur.close()
#         flash('changes had been done')
#         return redirect(url_for('libhome'))
#     form=shiftshelf()
#     return render_template('shiftshelf.html',form=form)




# @app.route('/logout/')
# def logout():
#     session['logged_in'] = False
#     session.clear()
#     return redirect(url_for('login'))

if __name__ == '__main__':
    app.run()