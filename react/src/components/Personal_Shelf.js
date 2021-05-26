import React, { useState, useEffect } from 'react';

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
		return (
			<div>
				{shelf.length}
			</div>
		);
	}
	else {
		return null
	}
}