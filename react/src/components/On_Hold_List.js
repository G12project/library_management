import React, { useState, useEffect } from 'react';
import {Lists } from './ListComponent'

export const OnHoldList = () =>{

	function Detail({book}){
		return(
			<div key={book.isbn_no}>
		<Media>
      <Media left top href={`/home/detail/${book.isbn_no}`}>
				<Media object src={`/static/images/${book.image}`}  className="medimg"/>
				</Media>
				<Media body>
        <Media heading>
					{book.title}
					</Media>
			{/* Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link> */}
			Author: {book.author}
			hold Date: {book.hold_date}
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
				<Media object src={`/static/images/${book.image}`}  className="medimg"/>
				</Media>
				<Media body>
        <Media heading>
					{book.title}
					</Media>
			{/* Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link> */}
			Author: {book.author}
			hold Date: {book.req_date}
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
		const requestedlist= hold.map((book)=>{
			return (
				<Req book={book}/>
			)
			
		});
		return (
			<div>
				<p>{holdlist}</p>
				<p>{requestedlist}</p>
			
			</div>
		);	
		
		
	}
	else {
		return null
	}
}