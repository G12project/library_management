import React, { useState, useEffect } from 'react';
import { Lists } from './ListComponent';
import { Button, Media} from 'reactstrap';
import { Link } from 'react-router-dom';

function ShowList({ book, reset }) {
	return (
		<Media>
      <Media left href="#">
				<Link to={`/home/detail/${book.isbn_no}`}><img src={`/static/images/${book.image}`} width="150" /></Link>
				</Media>
			<Media body style={{ paddingLeft: "10px" }}>
				<Media heading>
					<h2>{book.title}</h2>
				</Media>
				Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link><br />
				Author: {book.author}
				<Media bottom><Button color="link" size="sm" onClick={() => {
					fetch(`/homedata/shelf/remove/${book.isbn_no}`).then(response =>
						response.json().then(res => {
							console.log(res.message);
							reset();
						})
					)
				}}>Remove</Button></Media>
			</Media>
		</Media>
	);
};
export const PersonalShelfList = () => {
	const [shelf, setshelf] = useState(null);
	const [remove, setremove] = useState(false);
	const reset=()=>{
		setremove(!remove);
	}
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
	}, [remove]);
	if (shelf) {
		const shelflist = shelf.map((book) => {
			return (
				<ShowList book={book} reset={reset}/>
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