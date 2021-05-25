import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

function ShowDetail({reviews}){
	return(
		<div>
			{reviews.length}
		</div>
	);
}

export const BookDetail = () =>{
	let { isbn } = useParams();
	let url='/homedata/'+isbn;
	console.log(url);
	const [book, setbook]=useState();
	const [reviews, setreviews] =useState();
	// const [rating, setrating]=useState(0);
	// const [review, setreview]=useState('');
	useEffect(()=>{
		console.log("IN");
		fetch(url).then(response =>
			response.json().then(data => {
				console.log(data.bookdetail);
				setbook(data.bookdetail);
				console.log(data.reviews);
				setreviews(data.reviews);
			})
		);
	}, [url]);
	if (book) {
		return <div>{book.author}</div>;
	} else {
		return null;
	}
}