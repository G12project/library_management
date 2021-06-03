import React, { useState, useEffect } from 'react';
import { Lists } from './ListComponent';
import {Media, Row, Col} from 'reactstrap';
import { Link } from 'react-router-dom';


function ShowList({ book }) {
	return (
		<div key={book.isbn_no}>
		<Media>
      <Media left top href={`/home/detail/${book.isbn_no}`}>
				<Media object src={`/static/images/${book.image}`} className="medimg"/>
				</Media>
				<Media body>
        <Media heading>
					{book.title}
					</Media>
			{/* Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link> */}
			Author: {book.author}
			Issue Date: {book.issued_date}
			Due Date: {book.due_date}
			</Media>
			</Media>
		</div>


	);
};

export const OnLoanList = (props) => {
	const [loans, setloans] = useState(null);
	const [charges, setcharges] = useState(null);
	useEffect(() => {
		let mounted=true;
		fetch('/homedata/loans').then(response =>
			response.json().then(data => {
				console.log(data);
				console.log(data.loans);
				console.log(data.charges);
				if(mounted){
					setloans(data.loans);
					setcharges(data.charges);
				}
			})
		);

		return function cleanup(){
			mounted=false;
		}
	}, []);
	if (loans) {
		const loanlist= loans.map((book)=>{
			return (
				<ShowList book={book} />
			)
		});
		return (
			<div>
			<Lists />
							{loanlist}
			</div>
		);
	}
	else {
		return null
	}
}