import React, { useState, useEffect } from 'react';
import { Lists } from './ListComponent';
import {Col, Row} from 'reactstrap';
import { Link } from 'react-router-dom';


function ShowList({ book }) {
	return (
		<Row>
			<Col sm="12" md={{ size: 3, offset: 0 }}>
				<Link to={`/home/detail/${book.isbn_no}`}><img src={`/static/images/${book.image}`} width="200" /></Link>
			</Col>
			<Col sm="12" md={{ size: 5, offset: 0 }}>
					<h2>{book.title}</h2>
			Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link><br />
			Author: {book.author}<br />
			Issue Date: {book.issued_date}<br/>
			Due Date: {book.due_date}<br/>
			</Col>

		</Row>
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
				{/* <div>Total Fine: {charges}</div> */}
			</div>
		);
	}
	else {
		return null
	}
}