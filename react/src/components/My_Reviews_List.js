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
			<div>
				{reviews.length}
			</div>
		);
	}
	else {
		return null
	}
}