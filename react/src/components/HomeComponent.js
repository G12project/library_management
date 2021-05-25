import React from 'react';
import { Link } from 'react-router-dom';
// import StarRating from 'react-star-rating'
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
export const Home = ({data})=>{
	const books = data.map((book) =>{
		return(
			<RenderBook book={book}/>
		)
	});
	return (
	<CardDeck>
		{books}
	</CardDeck>
	);
}