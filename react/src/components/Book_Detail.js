import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

function ShowDetail({reviews}){
	return(
		<div>
			{reviews.length}
		</div>
	);
}

export const BookDetail = (props) =>{
	let { isbn } = useParams();
	let url='/homedata/'+isbn;
	const history= useHistory();
	console.log(url);
	const [book, setbook]=useState();
	const [reviews, setreviews] =useState();
	const [rating, setrating]=useState(5);
	const [review, setreview]=useState('');
	useEffect(()=>{
		let mounted=true;
		console.log("IN");
		fetch(url).then(response =>
			response.json().then(data => {
				console.log(data.bookdetail);
				console.log(data.reviews);
				if (mounted){
					setbook(data.bookdetail);
					setreviews(data.reviews);
				}
			})
		);
		return function cleanup() {
			mounted = false;
		}
	}, [url]);
	if (book && reviews) {
		return(
		<div>
			{book.author}
			<Button onClick={()=>{
				if (!props.is_authenticated) { alert("Login in to continue"); history.push('/loginpage'); }
				else{
						fetch('/homedata/hold/'+isbn).then(response =>
						response.json().then((res)=>{
							console.log(res.message)
							history.push('/list/onhold')
						})
					)
				}
			}}>Request Hold</Button>
			<Button onClick={()=>{
				if(!props.is_authenticated) {alert("Login in to continue"); history.push('/loginpage');}
				else{
					fetch('/homedata/loan/'+isbn).then(response =>
						response.json().then(res=> {
							console.log(res.message);
							history.push('/list/onloan');
						})
					)
				}
			}}>Borrow</Button>
			<Button onClick={()=>{
				if (!props.is_authenticated) { alert("Login in to continue"); history.push('/loginpage'); }
				else{
					fetch('/homedata/shelf/add/'+isbn).then( response =>
						response.json().then(res=>{
							console.log(res.message)
							history.push('/list/shelf')
						})
					)
				}
			}}>Add to Personal Shelf</Button>
				<Form onSubmit={async (event) => {
					event.preventDefault();
					const data = { rating, review};
					await fetch('/homedata/review/'+isbn, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)
					}).then(
						response =>
							response.json().then(res=>
								console.log(res.message))
					)
				}}>
					<FormGroup>
						<Label htmlFor="rating">Rating</Label>
						<Input type="number" id="rating" name="rating"
							value={rating}
							onChange={e => setrating(e.target.value)} />
					</FormGroup>
					<FormGroup>
						<Label htmlFor="review">Review</Label>
						<Input type="text" id="review" name="review"
							value={review}
							onChange={e => setreview(e.target.value)} />
					</FormGroup>
					<Button type="submit" value="submit" color="primary">Login</Button>
				</Form>
		</div>
		);
	} else {
		return null;
	}
}