import React, { useState, useEffect } from 'react';
import {Media, Container} from 'reactstrap'
import StarRatings from 'react-star-ratings';

function ShowDetail({reviews}){
	return(
		<Media>
		<Media heading>
			{reviews.title}
		</Media>
		<Media body>
        <Media heading>
		  <StarRatings
					rating={reviews.rating}
					starDimension="25px"
					starSpacing="5px"
					starRatedColor="#ffff00"
				/>
        </Media>
        {reviews.review}
    	</Media>
		</Media>
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
				<ShowDetail reviews={review} />
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