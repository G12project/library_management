from flask import Flask
from flask_mysqldb import MySQL
from datetime import datetime
from flask import render_template, request, redirect, url_for, json, jsonify, flash, session
from wtforms import Form, BooleanField, StringField, PasswordField, SubmitField ,validators, TextAreaField, IntegerField
from wtforms.validators import DataRequired
from werkzeug.security import check_password_hash, generate_password_hash
app = Flask(__name__)
app.config["SECRET_KEY"] = "OCML3BRawWEUeaxcuKHLpw"

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'testt'

mysql = MySQL(app)
# con=mysql.connection()
# cur = con.cursor()
class RegisterForm(Form):
    username=StringField("Username", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    address=StringField("Address", validators=[validators.Length(min=10, max=25), validators.DataRequired(message="Please Fill This Field")])
    password = PasswordField("Password", validators=[validators.DataRequired(message="Please Fill This Field")])
    email = StringField("Email", validators=[validators.Email(message="Please enter a valid email address")])
    faculty=BooleanField("faculty")
    submit = SubmitField('Submit')

class LoginForm(Form):
    email = StringField("Email", validators=[validators.Email(message="Please enter a valid email address")])
    password = PasswordField("Password", validators=[validators.DataRequired(message="Please Fill This Field")])
    submit = SubmitField('Submit')

class libRegisterForm(Form):
    username=StringField("Username", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    email = StringField("Email", validators=[validators.Email(message="Please enter a valid email address")])
    address=StringField("Address", validators=[validators.Length(min=10, max=25), validators.DataRequired(message="Please Fill This Field")])
    password = PasswordField("Password", validators=[validators.DataRequired(message="Please Fill This Field")])
    submit = SubmitField('Submit')
class addbook(Form):
    isbn_no=IntegerField("isbn_no", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    title=StringField("title", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    author=StringField("author", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    genre=StringField("genre", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    yop=IntegerField("publication year", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    copy_no=IntegerField("Copy", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    shelf_id=IntegerField("shelf_id", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    submit = SubmitField('Submit')
class delete(Form):
    isbn_no=IntegerField("isbn_no", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    copy_no=IntegerField("Copy", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    shelf_id=IntegerField("shelf_id", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    submit = SubmitField('Submit')
class shiftshelf(Form):
    isbn_no=IntegerField("isbn_no", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    copy_no=IntegerField("No of copies", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    newshelf_id=IntegerField("newshelf_id", validators=[validators.Length(min=3, max=25), validators.DataRequired(message="Please Fill This Field")])
    submit = SubmitField('Submit')

class SearchForm(Form):
    getall=BooleanField("See all books")
    book= StringField("Book_Title OR Author")
    submit = SubmitField('Submit')
class ReviewForm(Form):
    rating=IntegerField("1-5", validators=[validators.Length(min=1, max=5)])
    Review= TextAreaField("Review")
    submit = SubmitField('Submit')
class SearchUsers(Form):
    name= StringField("name or email")
    submit = SubmitField('Submit')

@app.route('/', methods=['GET'])
def front():
    return redirect(url_for('home'))
@app.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        form = RegisterForm(request.form)
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        username=form.username.data
        address=form.address.data
        faculty=form.faculty.data
        email = form.email.data
        desig='student'
        if faculty:
            desig='faculty'
        fines=0
        con=mysql.connection
        cur = con.cursor()
        cur.execute("INSERT INTO user(name, email, password, address, fines, designation) VALUES (%s, %s, %s, %s, %s, %s)", (username,email,hashed_password,address,fines,desig,))
        con.commit()
        cur.close()
        flash('Thank You for registering')
        return redirect(url_for('login'))
    form=RegisterForm()
    return render_template('index.html',form=form)

@app.route('/login/',methods=['GET','POST'])
def login():
    if request.method=="POST":
        form=LoginForm(request.form)
        email = form.email.data
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        con=mysql.connection
        cur = con.cursor()
        cur.execute("Select user_id, password from user where email=%s",(email,))
        con.commit()
        user=cur.fetchone()
        cur.close()
        if user:
            if check_password_hash(user[1], form.password.data):
                session['logged_in']=True
                session['user_id']=user[0]
                session['email'] = email
                print('1')
                return redirect(url_for('home'))
        else:
            flash('Username or Password Incorrect', "Danger")
            return redirect(url_for('login'))
    form=LoginForm()
    return render_template('login.html',form=form)

@app.route('/home/', methods=['GET'])
def home():
    email=None
    data=None
    if not session.get('logged_in') is None and session['logged_in']:
        email=session['email']
        con=mysql.connection
        cur = con.cursor()
        cur.execute("select isbn_no, title, author, genre from books where genre in(select genre from books where isbn_no in(select isbn_no from reviews where rating>2 and user_id=%s))", (int(session['user_id']),))
        con.commit()
        data=cur.fetchall()
        cur.close()
    form=SearchForm()
    return render_template('home.html', user=email, form=form, data=data)
@app.route('/home/search', methods=['GET', 'POST'])
def search():
    form=SearchForm(request.form)
    if request.method == "POST":
        allbook=form.getall.data
        if allbook:
            con=mysql.connection
            cur = con.cursor()
            cur.execute("SELECT isbn_no, title, author from books")
            con.commit()
            data=cur.fetchall()
            cur.close()
        else:
            book=form.book.data
            # search by author or book
            con=mysql.connection
            cur = con.cursor()
            cur.execute("SELECT isbn_no, title, author from books WHERE title LIKE %s OR author LIKE %s", (book, book,))
            con.commit()
            data=cur.fetchall()
            cur.close()
        # all in the search box will return all the tuples
        if data:
            return render_template('search.html', data=data)
    return redirect(url_for('home'))

@app.route('/home/<isbn>', methods=['GET', 'POST'])
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
    form=ReviewForm()
    return render_template('book_detail.html', data=data, data1=data1, form=form)

@app.route('/home/hold/<isbn>', methods=['GET', 'POST'])
def on_hold(isbn):
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("SELECT 1 FROM book_copies WHERE isbn_no=%s AND user_id=%s", (int(isbn), int(session['user_id']),))
    con.commit()
    data=cur.fetchone()
    cur.close()
    if data!=None:
        flash('Already requested')
        return redirect(url_for('hold_list'))
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
        return redirect(url_for('hold_list'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("INSERT IGNORE INTO on_hold(user_id, isbn_no) values(%s,%s)",(session['user_id'],int(isbn),))
    con.commit()
    cur.close()
    flash('We will keep the book on hold for you once it is available')
    return redirect(url_for('hold_list'))

@app.route('/home/loan/<isbn>', methods=['GET', 'POST'])
def on_loan(isbn):
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    status='on_shelf'
    con=mysql.connection
    cur=con.cursor()
    print(isbn)
    cur.execute("SELECT fines, designation from user where user_id=%s",(session['user_id'],))
    con.commit()
    fine=cur.fetchone()
    if fine[0]>1000:
        print('Too much debt')
        flash('Too much debt')
        cur.close()
        return redirect(url_for('borrowed_list'))
    con=mysql.connection
    cur=con.cursor()
    cur.execute("SELECT COUNT(*) from book_copies where user_id=%s",(session['user_id'],))
    con.commit()
    count=cur.fetchone()
    if count[0]>3 and fine[1]=='student':
        print('Too many books')
        flash('Too many books')
        cur.close()
        return redirect(url_for('borrowed_list'))
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
        return redirect(url_for('borrowed_list'))
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
        return redirect(url_for('borrowed_list'))
    flash('Book Not Available Currently')
    return redirect(url_for('home'))

@app.route('/home/return/<isbn>', methods=['GET', 'POST'])
def _return(isbn):
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    bool=None
    status='on_shelf'
    con=mysql.connection
    cur = con.cursor()
    cur.execute("UPDATE book_copies SET user_id=%s AND current_status=%s WHERE isbn_no=%s AND user_id=%s",(bool,status,int(isbn),int(session['user']),))
    con.commit()
    cur.close()
    return redirect(url_for('borrowed_list'))

@app.route('/home/on_hold', methods=['GET', 'POST'])
def hold_list():
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
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
    return render_template('hold_list.html', data1=data, data2=data1)


@app.route('/home/loans', methods=['GET', 'POST'])
def borrowed_list():
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("SELECT book_copies.isbn_no, books.title, books.author, book_copies.issued_date, book_copies.due_date FROM book_copies, books where book_copies.user_id=%s AND book_copies.isbn_no=books.isbn_no",(int(session['user_id']),))
    con.commit()
    data=cur.execute("SELECT book_copies.isbn_no, books.title, books.author, book_copies.issued_date, book_copies.due_date FROM book_copies, books where book_copies.user_id=%s AND book_copies.isbn_no=books.isbn_no",(int(session['user_id']),))
    con.commit()
    data=cur.fetchall()
    cur.execute("SELECT fines FROM user where user_id=%s",(int(session['user_id']),))
    con.commit()
    fines=cur.fetchone()
    cur.close()
    return render_template('borrowed_list.html', data=data, charges=fines[0])

@app.route('/home/shelf', methods=['GET', 'POST'])
def personal_shelf_list():
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("SELECT personal_shelf.isbn_no, books.title, books.author, books.genre FROM personal_shelf, books where personal_shelf.user_id=%s AND personal_shelf.isbn_no=books.isbn_no",(int(session['user_id']),))
    con.commit()
    data=cur.fetchall()
    cur.close()
    return render_template('personal_shelf_list.html', data=data)

@app.route('/home/shelf/add/<isbn>', methods=['GET', 'POST'])
def add(isbn):
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("INSERT IGNORE INTO personal_shelf (user_id, isbn_no) values(%s, %s)",(int(session['user_id']), int(isbn),))
    con.commit()
    cur.close()
    return redirect(url_for('personal_shelf_list'))
@app.route('/home/review/<isbn>', methods=['GET', 'POST'])
def add_review(isbn):
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    form=ReviewForm(request.form)
    if request.method == "POST":
        rat=form.rating.data
        review=None
        if form.Review.data:
            review=form.Review.data
        con=mysql.connection
        cur = con.cursor()
        cur.execute("INSERT IGNORE INTO reviews (user_id, isbn_no, rating, review) values(%s, %s, %s, %s)",(int(session['user_id']), int(isbn),int(rat), review,))
        con.commit()
        cur.close()
    return redirect(url_for('review_list'))
@app.route('/home/reviews', methods=['GET', 'POST'])
def review_list():
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("SELECT reviews.isbn_no, books.title, books.author, reviews.rating, reviews.review FROM reviews, books where reviews.user_id=%s AND reviews.isbn_no=books.isbn_no",(int(session['user_id']),))
    con.commit()
    data=cur.fetchall()
    cur.close()
    return render_template('review_list.html', data=data)
@app.route('/home/users', methods=['GET', 'POST'])
def search_users():
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    form=SearchUsers(request.form)
    if request.method == "POST":
        rat=form.name.data
        con=mysql.connection
        cur = con.cursor()
        cur.execute("Select user_id, name FROM user where name LIKE %s OR email LIKE %s", (rat, rat,))
        con.commit()
        data=cur.fetchall()
        cur.close()
        return render_template('user_list.html', form=form, data=data)
    return render_template('user_list.html',form=form, data=None)
@app.route('/home/friend/<user_id>', methods=['GET', 'POST'])
def add_friend(user_id):
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("INSERT IGNORE INTO friend_list(user_id, user_id1) values(%s, %s)",(int(session['user_id']), int(user_id),))
    con.commit()
    cur.close()
    return redirect(url_for('friend_list'))
@app.route('/home/friends', methods=['GET', 'POST'])
def friend_list():
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("SELECT friend_list.user_id1, user.name FROM friend_list, user where friend_list.user_id1=user.user_id AND friend_list.user_id=%s",(int(session['user_id']),))
    con.commit()
    data=cur.fetchall()
    cur.close()
    return render_template('friend_list.html', data=data)
@app.route('/home/user/shelf/<user_id>', methods=['GET', 'POST'])
def book_shelf(user_id):
    if not session.get('logged_in'):
        flash('Login to continue')
        return redirect(url_for('login'))
    con=mysql.connection
    cur = con.cursor()
    cur.execute("SELECT personal_shelf.isbn_no, books.title, books.author, books.genre FROM personal_shelf, books where personal_shelf.user_id=%s AND personal_shelf.isbn_no=books.isbn_no",(int(user_id),))
    con.commit()
    data=cur.fetchall()
    cur.close()
    return render_template('friends_shelf_list.html', data=data)
@app.route('/liblogin/', methods=['GET', 'POST'])
def liblogin():
    if request.method=="POST":
        form=LoginForm(request.form)
        email=form.email.data
        con=mysql.connection
        cur = con.cursor()
        cur.execute("Select lib_id, password from librarian where email=%s",(email,))
        con.commit()
        lib=cur.fetchone()
        cur.close()
        if lib:
            if check_password_hash(lib[1], form.password.data):
                session['logged_in']=True
                session['username']=lib[0]
                session['email'] = email
                session['account_type'] == 'lib'
                return redirect(url_for('libhome'))
        else:
            flash('Username or Password Incorrect', "Danger")
            return redirect(url_for('liblogin'))
    form=LoginForm()
    return render_template('liblogin.html',form=form)

@app.route('/libhome/', methods=['GET', 'POST'])
def libhome():
    return render_template('libhome.html')

@app.route('/libregistration/', methods=['GET', 'POST'])
def libreg():
    if request.method == "POST":
        form = libRegisterForm(request.form)
        hashed_password = generate_password_hash(form.password.data, method='sha256')
        username=form.username.data
        address=form.address.data
        email = form.email.data
        con=mysql.connection
        cur = con.cursor()
        cur.execute("INSERT INTO librarian(name, email, password, address) VALUES (%s,%s, %s %s)", (username,email,hashed_password,address,))
        con.commit()
        cur.close()
        flash('Thank You for registering')
        return redirect(url_for('libhome'))
    form=libRegisterForm()
    return render_template('addlibrarian.html',form=form)

@app.route('/addbooks/',methods=['GET', 'POST'])
def addbook1():
    if request.method=="POST":
        form=addbook(request.form)
        isbn_no=form.isbn_no.data
        title=form.title.data
        author=form.author.data
        yop=form.yop.data
        genre=form.genre.data
        copy_no=form.copy_no.data
        shelf_id=form.shelf_id.data
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


@app.route('/deletebooks/',methods=['GET', 'POST'])
def deletebook():
    if request.method=="POST":
        form=delete(request.form)
        isbn_no=form.isbn_no.data
        copy_no=form.copy_no.data
        shelf_id=form.shelf_id.data
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

@app.route('/shiftshelf/',methods=['GET', 'POST'])
def shiftshelf1():
    if request.method=="POST":
        form=shiftshelf(request.form)
        isbn_no=form.isbn_no.data
        copy_no=form.copy_no.data
        newshelf_id=form.newshelf_id.data
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




@app.route('/logout/')
def logout():
    session['logged_in'] = False
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run()