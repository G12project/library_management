from flask import Blueprint, render_template, request, redirect, url_for,jsonify, flash, session, make_response

from flask import Blueprint
from routes.db import mysql

shelfchange=Blueprint('shelfchange', __name__)
@shelfchange.route('/deletebooks/',methods=['GET', 'POST'])
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