import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button, Col} from 'reactstrap';
import '../styles/loginform.css';

export const LoginForm = (props)=>{
	const[email,setemail]=useState('');
	const[password, setpassword]= useState('');
	const [error, seterror] = useState('');
	const history=useHistory();
	return(
		<div className="container">
		{error}
			<Form className="text-left" onSubmit={async (event) => {
			event.preventDefault();
			const user = { email, password };
			await fetch('/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			}).then(
				(response) => {
					if (response.status === 201) {
						response.json().then((responseJson) => {
							console.log("OK");
							props.set_is_authenticated(true);
							props.setuser(responseJson['user']);
							const storeuser = { user: responseJson['user'] };
							localStorage.setItem("user", JSON.stringify(storeuser));
							console.log(responseJson['user']);
							history.push('/home');
						})
					}
					else {
						console.log("Error");
						seterror('Login Failed! Try Again');
					}
				})
		}}>
			<FormGroup row>
				<Col md="4">
				<Label for="email">Email</Label>
				</Col>
				<Col md="12">
				<Input type="text" id="email" name="email"
					value={email}
					onChange={e =>setemail(e.target.value)} />
				</Col>
			</FormGroup>
			<FormGroup row>
				<Col md="4">
				<Label for="password">Password</Label>
				</Col>
				<Col md="12">
				<Input type="password" id="password" name="password"
					value={password}
					onChange={e => setpassword(e.target.value)} />
				</Col>
			</FormGroup>
			<Button type="submit" value="submit" className="sub-btn" color="primary" block>Sign In</Button>
		</Form>
		</div>
	);
}