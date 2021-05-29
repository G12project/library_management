import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import { Card, CardText, CardBody, CardTitle, CardDeck } from 'reactstrap';


export const LibHome = (props) => {
	const[allbooks, setallbooks]=useState();
	useEffect(() => {
		let mounted = true;
		fetch('/homedata/search/' + 1).then(response =>
			response.json().then(data => {
				console.log(data.books);
				setallbooks(data.books);
			})
		)
		return function cleanup() {
			mounted = false;
		}
	}, []);
	if(allbooks)
	return (
		<div>Welcome {props.user}<div>{allbooks.length}</div></div>
	)
	else return null
}