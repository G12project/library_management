import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import { Card, CardText, CardBody, CardTitle, CardDeck } from 'reactstrap';
import StarRatings from './react-star-ratings';

function RenderBook({ book }) {
	return (
		<Card style={{ width: "18rem" }}>
			<CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
			<CardBody>
				<Link to={`/home/detail/${book.isbn_no}`}><CardTitle>{book.title}</CardTitle></Link>
				<CardText>
					<p>{book.author}</p>
					<p>{book.genre}</p>
				</CardText>
			</CardBody>
			<StarRatings
        rating={book.rating}
        starDimension="40px"
        starSpacing="15px"
		starRatedColor="#ffff00"
      />

		</Card>
	);
}
export const Home = (props)=>{
	const [data, setdata]=useState();
	const [searchres, setsearchres]=useState([]);
	const [search, setsearch]=useState();
	useEffect(()=>{
		let mounted=true;
		fetch('/homedata').then(response =>
			response.json().then(data => {
				console.log(data.data);
				if(mounted)
				setdata(data.data);
			})
		);
		return function cleanup() {
			mounted = false;
		}
	}, []);
	if(data){
		const books = data.map((book) => {
			return (
				<div className="col-12 col-md-5 m-1">
				<RenderBook book={book} />
				</div>
			)
		});
		const res = searchres.map((book)=>{
			return(
				<div className="col-12 col-md-5 m-1">
				<RenderBook book={book} />
				</div>
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
				<Button type="submit" value="submit" color="primary">search</Button>
			</Form>
			<div className="container">
				<p>Results</p>
				<div className="row">
			{res}
			</div>
			
				<p>Recommendations</p>
				<div className="row">
			
				{books}
				</div>
			
			</div>
		</div>
		);
	}
	else
		return null;
}