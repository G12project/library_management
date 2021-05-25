import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import { Card, CardText, CardBody, CardTitle, CardDeck } from 'reactstrap';

function RenderBook({ book }) {
	return (
		<Card style={{ width: "18rem" }}>
			<CardBody>
				<Link to={`/home/${book.isbn_no}`}><CardTitle>{book.title}</CardTitle></Link>
				<CardText>
					<p>{book.author}</p>
					<p>{book.genre}</p>
				</CardText>
			</CardBody>

		</Card>
	);
}
export const Home = (props)=>{
	const [data, setdata]=useState();
	const [searchres, setsearchres]=useState([]);
	const [search, setsearch]=useState();
	useEffect(()=>{
		fetch('/homedata').then(response =>
			response.json().then(data => {
				console.log(data.data);
				setdata(data.data);
			})
		);
	}, []);
	if(data){
		const books = data.map((book) => {
			return (
				<RenderBook book={book} />
			)
		});
		const res = searchres.map((book)=>{
			return(
				<RenderBook book={book} />
			)
		});
		return (
		<div>
			<Button color="primary" onClick={()=>{
				fetch('/homedata/search/'+1).then(response =>
					response.json().then(data => {
						console.log(data.books);
						setsearchres(data.books);
					})
				)
			}}>Show all Books</Button>
			<Form onSubmit={(event) => {
				event.preventDefault();
				const key = { search };
				fetch('/homedata/search/0', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(key)
				}).then(
					(response) => response.json().then(data => {
						console.log(data.books);
						setsearchres(data.books);
					})
				)
				}}>
				<FormGroup>
					<Label htmlFor="search">Search</Label>
					<Input type="text" id="search" name="seacrh"
						value={search}
						onChange={e => setsearch(e.target.value)} />
				</FormGroup>
				<Button type="submit" value="submit" color="primary">Login</Button>
			</Form>
			<div>
				<p>Results</p>
			{res}
			</div>
			<div>
				<p>Recommendations</p>
			<CardDeck>
				{books}
			</CardDeck>
			</div>
		</div>
		);
	}
	else
		return null;
}