import React, { useState, useEffect } from 'react';
import { Lists } from './ListComponent';
import { Row, Col, Media} from 'reactstrap';
import { Link } from 'react-router-dom';

function ShowList({ book }) {
	return (
		<Row>
			<Col sm="12" md={{ size: 3, offset: 0 }}>
				<Link to={`/home/detail/${book.isbn_no}`}><img src={`/static/images/${book.image}`} width="200"/></Link>
			</Col>
			<Col sm="12" md={{ size: 5, offset: 0 }}>
			<Media body>
					<h2>{book.title}</h2>
					Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link><br/>
					Author: {book.author}<br/>
					Genre: {book.genre}
				</Media>
				</Col>

		</Row>
	);
};
export const PersonalShelfList = () => {
	const [shelf, setshelf] = useState(null);
	useEffect(() => {
		let mounted = true;
		fetch('/homedata/shelf').then(response =>
			response.json().then(data => {
				console.log(data);
				console.log(data.shelf);
				if (mounted) {
					setshelf(data.shelf);
				}
			})
		);

		return function cleanup() {
			mounted = false;
		}
	}, []);
	if (shelf) {
		const shelflist = shelf.map((book) => {
			return (
				<ShowList book={book} />
			)
		});
		return (
			<div className="container">
				<Lists />
					{shelflist}


			</div>
		);
	}
	else {
		return null
	}
}