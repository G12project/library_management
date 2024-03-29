CREATE TABLE user(
name VARCAR(50) NOT NULL,
password Varchar(500) NOT NULL,
address VARCHAR(60) NOT NULL,
user_id INT NOT NULL AUTO_INCREMENT,
fines INT NOT NULL,
designation VARCHAR(45) NOT NULL,
PRIMARY KEY(user_id));

CREATE TABLE books(
isbn_no VARCHAR(45) NOT NULL,
title VARCHAR(100) NOT NULL,
author VARCHAR(100) NOT NULL,
year_of_publication INT NOT NULL,
genre VARCHAR(100) NOT NULL,
PRIMARY KEY(isbn_no));


CREATE TABLE book_copies(
isbn_no VARCHAR(45) NOT NULL,
copy_no INT NOT NULL,
current_status VARCHAR(45),
shelf_id INT,
user_id INT,
issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
due_date DATETIME generated always as (issued_date + interval 1 month),
PRIMARY KEY(isbn_no, copy_no),
FOREIGN KEY (user_id) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (isbn_no) REFERENCES books(isbn_no) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (shelf_id) REFERENCES shelf(shelf_id) ON UPDATE CASCADE ON DELETE CASCADE);
CREATE TABLE shelf(
shelf_id INT Not Null,
capacity VARCHAR(45),
PRIMARY KEY(shelf_id));

CREATE TABLE librarian(
name VARCHAR(45),
password INT,
lib_id INT,
address VARCHAR(45),
PRIMARY KEY(lib_id));

CREATE TABLE friend_list(
user_id INT,
user_id1 INT,
PRIMARY KEY(user_id,user_id1),
FOREIGN KEY user_id REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY user_id1 REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE);

CREATE TABLE personal_shelf(
user_id INT NOT NULL,
isbn_no VARCHAR(45) NOT NULL,
PRIMARY KEY(user_id,isbn_no),
FOREIGN KEY (user_id) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (isbn_no) REFERENCES books(isbn_no) ON UPDATE CASCADE ON DELETE CASCADE);

CREATE TABLE on_hold(
user_id INT NOT NULL,
isbn_no VARCHAR(45) NOT NULL,
copy_no INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
hold_begins DATE,
FOREIGN KEY (user_id) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (isbn_no, copy_no) REFERENCES book_copies(isbn_no, copy_no) ON UPDATE CASCADE ON DELETE CASCADE);


CREATE table reviews(
user_id INT NOT NULL,
isbn_no VARCHAR(45) NOT NULL,
review VARCHAR(100),
rating INT NOT NULL,
PRIMARY KEY(user_id,isbn_no),
FOREIGN KEY (user_id) REFERENCES user(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
FOREIGN KEY (isbn_no) REFERENCES books(isbn_no) ON UPDATE CASCADE ON DELETE CASCADE);
