
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