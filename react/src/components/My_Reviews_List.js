import React, { useState, useEffect } from 'react';

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
		return (
			<Media>
		<Media heading>
		<StarRatings
					rating={reviews.rating}
					starDimension="25px"
					starSpacing="5px"
					starRatedColor="#ffff00"
				/>
		</Media>
		<Media body>
        <Media heading>
          {reviews.title}
        </Media>
        {reviews.review}
    	</Media>
		</Media>
		);
	}
	else {
		return null
	}
}