import React, { useState, useEffect } from 'react';

export const OnLoanList = () => {
	const [loans, setloans] = useState(null);
	const [charges, setcharges] = useState(null);
	useEffect(() => {
		let mounted=true;
		fetch('/homedata/loans').then(response =>
			response.json().then(data => {
				console.log(data);
				console.log(data.loans);
				console.log(data.charges);
				if(mounted){
					setloans(data.loans);
					setcharges(data.charges);
				}
			})
		);

		return function cleanup(){
			mounted=false;
		}
	}, []);
	if (loans) {
		return (
			<div>
				{loans.length}
				{charges}
			</div>
		);
	}
	else {
		return null
	}
}