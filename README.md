# Library Management

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup Project](#setup-project)
* [Setup Database](#setup-database)
* [Illustrations](#illustrations)
* [Contributers](#contributers)

## General info
This is a library management application for any kind of institution the main functions you can expect from this application,such as review a book,add friends in your friend list,a admin system etc.

## Technologies
Project is created with:
* Reactjs
* Flask
* Mysql

## Setup Project
To run this project, Clone this repo to your desktop:

```
$ cd react
$ npm install
$ cd..
$ cd flask
$ pip install -r requirements.txt
```
## Setup Database
* Create a file "filename.sql" and copy the contents from this [file](https://docs.google.com/document/d/1nzmPVmuokZn1_mkOJqJ8ZNw4vlAMMfAkYWciiPnRGXE/edit?usp=sharing)
* Create a database in your DB in which you want to import this file.
* From command-prompt/terminal, move to the directory where you have created a "filename.sql".
* Run the command:
` mysql -u username -p password database_name < filename.sql `

## Features
- View all the books available in the library
- Search a book
- Add book to your personal-shelf
- Keep books on-hold or on-loan
- Add people to your friend list
- Able to see your friend list
- Review Books
- For other awesome features clone the repo

#### There are two types of role
- **Librarian:** Can manipulate the Books data in the database
- **User:** Can view all the data and able to rate it

## Illustrations



## Contributers

-Yash Bontala [Github repo](https://github.com/Yashbontala)
-Jyotishna Baishya [Github repo](https://github.com/JyotishnaBaishya)
-Amit Kumar [Github repo](https://github.com/amit295-cse)








