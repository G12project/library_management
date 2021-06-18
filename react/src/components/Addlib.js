import React, { useState } from 'react';
import { Form, FormGroup, Input, Label, Button, Col, Row } from 'reactstrap';
import '../styles/loginform.css'
import { useToasts } from 'react-toast-notifications';

export const Addlib = (props) => {
	const [email, setemail] = useState('');
	const [password, setpassword] = useState('');
	const [username, setusername] = useState('');
	const [address, setaddress] = useState('');
	// const[error,seterror]=useState('');
	const { addToast } = useToasts();
	return (
		<div className="container">
			<Row><Col md="4">
			<Form onSubmit={async (event) => {
			event.preventDefault();
			const lib = { email, password, username, address };
			await fetch('/libregistration', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(lib)
			}).then(
				(response) =>{ response.json().then((responseJson) => {
					console.log(responseJson.message)
					addToast(responseJson.message, {
						appearance: 'info',
						autoDismiss: true,
						autoDismissTimeout: 8000,
					})
					})
			})
		}}>
				<FormGroup>
				<Label for="username">Username</Label>
				<Input type="text" id="username" name="username"
					value={username}
					onChange={e => setusername(e.target.value)} />
			</FormGroup>
			<FormGroup>
				<Label for="email">Email</Label>
				<Input type="text" id="email" name="email"
					value={email}
					onChange={e => setemail(e.target.value)} />
			</FormGroup>
			<FormGroup>
				<Label for="password">Password</Label>
				<Input type="password" id="password" name="password"
					value={password}
					onChange={e => setpassword(e.target.value)} />
			</FormGroup>
			<FormGroup>
				<Label for="address">Address</Label>
				<Input type="text" id="address" name="address"
					value={address}
					onChange={e => setaddress(e.target.value)} />

			</FormGroup>
			<Button type="submit" className="sub-btn" value="submit" color="primary">Add Librarian</Button>
		</Form>
		</Col></Row>
		</div>
	);
}