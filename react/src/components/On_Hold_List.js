import React, { useState, useEffect } from 'react';

export const OnHoldList = () =>{
	const [hold, sethold]= useState(null);
	const [requested, setrequested] = useState(null);
	useEffect(() => {
		let mounted=true;
		fetch('/homedata/onhold').then(response =>
			response.json().then(data => {
				console.log(data);
				console.log(data.hold);
				console.log(data.requested);
				if(mounted){
					sethold(data.hold);
					setrequested(data.requested);
				}
			})
		);

		return function cleanup() {
			mounted = false;
		}
	}, []);
	if(hold && requested){
		return (
			<div>
				{hold.length}
				{requested.length}
			</div>
		)
	}
	else {
		return null
	}
}