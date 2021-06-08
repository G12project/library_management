# Library Management

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup Project](#setup-project)
* [Setup Database](#setup-database)
* [Illustrations](#illustrations)
* [Contributers](#contributers)

## General info
This is a library management application for any kind of institution. The main functions include searching and viewing books, borrowing and requesting hold, review a book, add friends in your friend list, a library admin system etc.

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
* Create a database in your DB in which you want to import this [file](blob/main/mysql/create.ddl).
* From command-prompt/terminal, move to the "mysql" directory of the project.
* Run the command:
` mysql -u username -p password database_name < create.ddl `

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

- Yash Bontala [Github repo](https://github.com/Yashbontala)
- Jyotishna Baishya [Github repo](https://github.com/JyotishnaBaishya)
- Amit Kumar [Github repo](https://github.com/amit295-cse)








