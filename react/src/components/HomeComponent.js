import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import {Carousel, CarouselItem, CarouselControl, CarouselIndicators,CarouselCaption } from 'reactstrap';
import { Card, CardText, CardBody, CardTitle, CardImg, Row, Col, Container} from 'reactstrap';
import StarRatings from 'react-star-ratings';
import Truncate from 'react-truncate';

function Featured({books}){
	const [activeIndex, setActiveIndex] = useState(0);
	const [animating, setAnimating] = useState(false);
	const next = () => {
		if (animating) return;
		const nextIndex = activeIndex === books.length - 1 ? 0 : activeIndex + 1;
		setActiveIndex(nextIndex);
	}
	const previous = () => {
		if (animating) return;
		const nextIndex = activeIndex === 0 ? books.length - 1 : activeIndex - 1;
		setActiveIndex(nextIndex);
	}
	const slides = books.map((book) => {
		return (
			<CarouselItem
				onExiting={() => setAnimating(true)}
				onExited={() => setAnimating(false)}
				key={book.isbn_no}
			>
				<Col>
					<Link to={`/home/detail/${book.isbn_no}`}><img src={`/static/images/${book.image}`} alt={book.title} style={{ width: "100%",
    					height: "400px"}} /></Link>
						<div><h4><strong> {book.title} </strong></h4></div>
						<div class="text-right"> {book.author}</div>
						<div>
						<StarRatings
							rating={parseFloat(book.rating)}
							starDimension="25px"
							starSpacing="5px"
							starRatedColor="#ffff00"
						/>
						</div>
				</Col>
			</CarouselItem>
		);
	});
	return (
		<Carousel
			activeIndex={activeIndex}
			next={next}
			previous={previous}
			ride='carousel'
		>
			{slides}
			<CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
			<CarouselControl direction="next" directionText="Next" onClickHandler={next} style={{color:"blue"}} />
		</Carousel>
	);

}
function RenderBook({ book }) {
	return (
		<Card style={{maxWidth:"16rem"}}>
			<Link to={`/home/detail/${book.isbn_no}`}><CardImg height="200" src={`/static/images/${book.image}`} alt={book.title} /></Link>
			<CardBody>
				<Link to={`/home/detail/${book.isbn_no}`}><CardTitle ><Truncate lines={2} ellipsis={<span>...</span>}>
					{book.title}
				</Truncate></CardTitle></Link>
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
export const Home = (props) => {
	const [data, setdata] = useState();
	const [searchres, setsearchres] = useState([]);
	const [featured, setfeatured]=useState([]);
	const [search, setsearch] = useState();
	useEffect(() => {
		let mounted = true;
		let url = '/homedata';
		if (props.is_lib) url = '/homedata/search/' + 1;
		fetch(url).then(response =>
			response.json().then(data => {
				console.log(data.books);
				if (mounted)
					setdata(data.books);
			})
		);
		fetch('/homedata/top').then(response=>{
			response.json().then(
				res=> setfeatured(res.books)
			)
		})
		return function cleanup() {
			mounted = false;
		}
	}, []);
	if (data) {
		const books = data.map((book) => {
			return (
				<Col md="4">
					<h6>Recommended</h6>
					<RenderBook book={book} />
				</Col>
			)
		});
		const res = searchres.map((book) => {
			return (
				<Col md="4">
					<RenderBook book={book} />
				</Col>
			)
		});
		if (props.is_lib) {
			return (
				<Container style={{maxWidth:"100%"}}>
					<Row>
						{books}
					</Row>
				</Container>

			)
		}
		else {
			return (
				<Container style={{maxWidth:"100%"}}>
					<Row className="show-grid"><Col md="8">
						<Row style={{paddingTop: "50px"}}>
							<Col md="8">
								<h5>Search for a book</h5>
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
									<Col>
									<Input type="text" id="search" name="seacrh"
											value={search} placeholder="e.g. Dear Martin, Tolkien"
											onChange={e => setsearch(e.target.value)} /></Col>
									<Col>
									<Button type="submit" value="submit" color="primary"><span className="fas fa-search"></span></Button></Col>
								</FormGroup>
							</Form>
							</Col>
							</Row>
						<div> <h6>or</h6></div>
						<Row>
							<Button color="link" onClick={() => {
								fetch('/homedata/search/' + 1).then(response =>
									response.json().then(data => {
										console.log(data.books);
										setsearchres(data.books);
									})
								)
							}}><h5>See it ALL!</h5></Button></Row>
					<Row>{res}</Row>
					<Row style={{ marginTop: "5px" }}>{books}</Row>
					</Col>
						<Col md="4" style={{height: "100vh", overflow: "auto"}} className="bg-dark">
						<Row style={{paddingTop: "5px", color: "white"}}>
							<Col><h4><strong>Top Rated:</strong></h4></Col>
						<Featured books={featured} />
						</Row>
					</Col>
					</Row>
				</Container>
			);
		}
	}
	else
		return null;
}