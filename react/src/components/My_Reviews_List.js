import React, { useState, useEffect } from 'react';
import {Media, Container} from 'reactstrap'
import StarRatings from 'react-star-ratings';
import {Link} from 'react-router-dom';

function ShowDetail({book}){
	return(
		<div key={book.isbn_no}>
			<Media>
				<Media left top href={`/home/detail/${book.isbn_no}`}>
					<Media object src={`/static/images/${book.image}`} width={150} />
				</Media>
				<Media body style={{paddingLeft: "10px"}}>
					<Media heading>
						{book.title}
					</Media>
					<div>
						<StarRatings
							rating={parseFloat(book.rating)}
							starDimension="25px"
							starSpacing="5px"
							starRatedColor="#ffff00"
						/>
					</div>
				Isbn: <Link to={`/home/detail/${book.isbn_no}`}>{book.isbn_no}</Link><br />
				Author: {book.author}<br />
				{book.review}
				</Media>
			</Media>
		</div>
	);
}

export const MyReviewsList = () => {
	const [reviews, setreviews] = useState(null);
	useEffect(() => {
		let mounted = true;
		fetch('/homedata/reviews').then(response =>
			response.json().then(data => {
				console.log(data);
				console.log(data.reviews);
				if (mounted) {
					setreviews(data.reviews);
				}
			})
		);

		return function cleanup() {
			mounted = false;
		}
	}, []);
	if (reviews) {
		const reviewlist  = reviews.map((review) =>{
			return (
				<ShowDetail book={review} />
			)
		});
		return (
		<div><Container style={{marginTop:"20px"}}>{reviewlist}</Container></div>
		);
	}
	else {
		return null
	}
}