import React, { useState, useEffect } from 'react';
import {Lists } from './ListComponent';
import {Media, Container} from 'reactstrap';
import {Link} from 'react-router-dom';

export const OnHoldList = () =>{

	function Detail({book}){
		return(
			<div key={book.isbn_no}>
		<Media>
			<Media left top href={`/home/detail/${book.isbn_no}`}>
				<Media object src={`/static/images/${book.image}`} width={150}/>
			</Media>
			<Media body style={{paddingLeft: "10px"}}>
				<Media heading>
					{book.title}
				</Media>
			Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link><br/>
			Author: {book.author}<br/>
			Hold Date: {book.begin}<br/>
			</Media>
		</Media>
		</div>

		);
	};
	function Req({book}){
		return(
			<div key={book.isbn_no}>
		<Media>
			<Media left top href={`/home/detail/${book.isbn_no}`}>
				<Media object src={`/static/images/${book.image}`} width={150} />
			</Media>
			<Media body style={{paddingLeft: "10px"}}>
				<Media heading>
						{book.title}
				</Media>
				Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link><br/>
				Author: {book.author}<br/>
			</Media>
		</Media>
		</div>

		);
	};
	const [hold, sethold]= useState(null);
	const [requested, setrequested] = useState(null);
	useEffect(() => {
		let mounted=true;
		fetch('/homedata/onhold').then(response =>
			response.json().then(data => {
				console.log(data);
				console.log(data.hold);
				console.log(data.requested);
				if(mounted){
					sethold(data.hold);
					setrequested(data.requested);
				}
			})
		);

		return function cleanup() {
			mounted = false;
		}
	}, []);
	if(hold && requested){
		const holdlist= hold.map((book)=>{
			return (
				<Detail book={book}/>
			)

		});
		const requestedlist= requested.map((book)=>{
			return (
				<Req book={book}/>
			)

		});
		return (
			<Container>
				<Lists/>

				<div><h6>Hold List</h6>{holdlist}</div>
				<div><h6>Requested</h6>{requestedlist}</div>

			</Container>
		);


	}
	else {
		return null
	}
}