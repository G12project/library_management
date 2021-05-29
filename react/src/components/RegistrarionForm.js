import React, { useState } from 'react';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import '../styles/loginform.css'

export const RegisterForm = (props) => {
	const [email, setemail] = useState('');
	const [password, setpassword] = useState('');
	const [username, setusername] = useState('');
	const [is_faculty, setis_faculty] = useState(false);
	const [address, setaddress] = useState('');
	const[error,seterror]=useState('');
	return (
		<div className="login">
			{error}
		<Form onSubmit={async (event) => {
			event.preventDefault();
			const user = { email, password, username, is_faculty, address };
			await fetch('/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
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

			<FormGroup>
					<div className="form-group w-75">
				<Label htmlFor="username">Username</Label>
				<Input type="text" id="username" name="username"
					value={username}
					onChange={e => setusername(e.target.value)} />
					</div>
			</FormGroup>
			<FormGroup>
					<div className="form-group w-75">
				<Label htmlFor="email">Email</Label>
				<Input type="text" id="email" name="email"
					value={email}
					onChange={e => setemail(e.target.value)} />
					</div>
			</FormGroup>
			<FormGroup>
				<div className="form-group w-75">
				<Label htmlFor="password">Password</Label>
				<Input type="password" id="password" name="password"
					value={password}
					onChange={e => setpassword(e.target.value)} />
					</div>
			</FormGroup>
			<FormGroup>
				<div className="form-group w-75">
				<Label htmlFor="address">Address</Label>
				<Input type="text" id="address" name="address"
					value={address}
					onChange={e => setaddress(e.target.value)} />
					</div>
			</FormGroup>
			<FormGroup>
					<div className="form-group w-75">
				<Label htmlFor="faculty">Faculty</Label>
				<Input type="checkbox" id="faculty" name="faculty"
					value={is_faculty}
					onChange={e => setis_faculty(!is_faculty)} />
					</div>
			</FormGroup>
			<Button type="submit" value="submit" color="primary">Register</Button>
		</Form>
		</div>
	);
}