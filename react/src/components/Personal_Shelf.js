import React, { useState, useEffect } from 'react';
import { Lists } from './ListComponent';
import { Row, Col, Media} from 'reactstrap';
import { Link } from 'react-router-dom';

function ShowList({ book }) {
	return (
		<Media>
      <Media left href="#">
				<Link to={`/home/detail/${book.isbn_no}`}><img src={`/static/images/${book.image}`} width="200" /></Link>
				</Media>
				<Media body>
        <Media heading>
					<h2>{book.title}</h2>
					</Media>

			Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link><br />
			Author: {book.author}<br />
			Issue Date: {book.issued_date}<br/>
			Due Date: {book.due_date}<br/>
			</Media>
			</Media>
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