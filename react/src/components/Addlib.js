import React, { useState } from 'react';
import { Form, FormGroup, Input, Label, Button, Col } from 'reactstrap';
import '../styles/loginform.css'

export const RegisterForm = (props) => {
	const [email, setemail] = useState('');
	const [password, setpassword] = useState('');
	const [username, setusername] = useState('');
	const [address, setaddress] = useState('');
	const[error,seterror]=useState('');
	return (
		<div className="container">
			{error}
			<Form className="text-left" onSubmit={async (event) => {
			event.preventDefault();
			const lib = { email, password, username, address };
			await fetch('/libregistration', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(lib)
			}).then(
				(response) =>{ if(response.status===201){response.json().then((responseJson) => {
					console.log(responseJson.message)
					console.log(responseJson)
					props.loginclick();
					})
				}
				else{
					console.log("Error");
					seterror('tryagain');
				}

			})
		}}>

				<FormGroup row>
				<Col md="4">
				<Label for="username">Username</Label>
				</Col>
				<Col md="12">
				<Input type="text" id="username" name="username"
					value={username}
					onChange={e => setusername(e.target.value)} />
					</Col>
			</FormGroup>
			<FormGroup row>
					<Col md="4">
				<Label for="email">Email</Label></Col>
				<Col md="12">
				<Input type="text" id="email" name="email"
					value={email}
					onChange={e => setemail(e.target.value)} />
				</Col>
			</FormGroup>
			<FormGroup row>
				<Col md="4">
				<Label for="password">Password</Label></Col>
				<Col md="12">
				<Input type="password" id="password" name="password"
					value={password}
					onChange={e => setpassword(e.target.value)} />
					</Col>
			</FormGroup>
			<FormGroup row>
				<Col md="4">
				<Label for="address">Address</Label></Col>
				<Col md="12">
				<Input type="text" id="address" name="address"
					value={address}
					onChange={e => setaddress(e.target.value)} />
					</Col>
			</FormGroup>
			<Button type="submit" className="sub-btn" value="submit" color="primary" block>Sign Up</Button>
		</Form>
		</div>
	);
}