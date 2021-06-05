import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button, Col} from 'reactstrap';
import '../styles/loginform.css';
import { useToasts } from 'react-toast-notifications';

export const LoginForm = (props)=>{
	const[email,setemail]=useState('');
	const[password, setpassword]= useState('');
	// const [error, seterror] = useState('');
	const { addToast } = useToasts();
	const history=useHistory();
	return(
		<div className="container">
		{/* {error} */}
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
					response.json().then((responseJson) => {
						console.log(responseJson.message)
						addToast(responseJson.message, {
							appearance: 'info',
							autoDismiss: true,
							autoDismissTimeout: 8000,
						})
					})
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