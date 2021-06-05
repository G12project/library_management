import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import { Card, CardText, CardBody, CardTitle, CardImg, Row, Col, Container } from 'reactstrap';
import StarRatings from 'react-star-ratings';

function RenderBook({ book }) {
	return (
		<Card style={{ width: "18rem" }}>
			<CardImg width="200" height="250" src={`/static/images/${book.image}`} alt={book.title} />
			<CardBody>
				<Link to={`/home/detail/${book.isbn_no}`}><CardTitle>{book.title}</CardTitle></Link>
				<CardText>
					<p>{book.author}</p>
					<p>{book.genre}</p>
				</CardText>
				<StarRatings
					rating={parseFloat(book.rating)}
					starDimension="25px"
					starSpacing="5px"
					starRatedColor="#ffff00"
				/>

			</CardBody>
		</Card>
	);
}
export const Home = (props)=>{
	const [data, setdata]=useState();
	const [searchres, setsearchres]=useState([]);
	const [search, setsearch]=useState();
	useEffect(()=>{
		let mounted=true;
		let url='/homedata';
		if (props.is_lib) url = '/homedata/search/' + 1;
		fetch(url).then(response =>
			response.json().then(data => {
				console.log(data.books);
				if(mounted)
				setdata(data.books);
			})
		);
		return function cleanup() {
			mounted = false;
		}
	}, []);
	if(data){
		const books = data.map((book) => {
			return (
				<Col>
				<h6>Recommended</h6>
				<RenderBook book={book} />
				</Col>
			)
		});
		const res = searchres.map((book)=>{
			return(
				<Col>
					<RenderBook book={book} />
				</Col>
			)
		});
		if(props.is_lib){
			return(
				<Row>
					{books}
				</Row>

			)
		}
		else{
			return (
			<Container>
				<Row>
					<Col md="4">
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
						<FormGroup row>
							<Col md="12">
							<Label htmlFor="search">Search</Label></Col>
							<Col md="10">
							<Input type="text" id="search" name="seacrh"
								value={search} placeholder="e.g. Dear Martin, Tolkien"
								onChange={e => setsearch(e.target.value)} /></Col>
						</FormGroup>
						<Col md="4" style={{marginTop: "10px"}}>
						<Button type="submit" value="submit" outline color="primary">Search</Button>
						</Col>
					</Form>
					</Col>
				</Row>
				<Row style={{marginTop: "10px"}}> <Col>
				<Button outline color="success" onClick={()=>{
					fetch('/homedata/search/'+1).then(response =>
						response.json().then(data => {
							console.log(data.books);
							setsearchres(data.books);
						})
					)
				}}>Show all Books</Button></Col></Row>
				<Row style={{marginTop:"20px"}}>{res}</Row>
				<Row style={{marginTop: "20px"}}>{books}</Row>
			</Container>
			);
		}
	}
	else
		return null;
}