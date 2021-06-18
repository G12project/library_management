import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button, Col } from 'reactstrap';
import '../styles/loginform.css'
import { useToasts } from 'react-toast-notifications';

export const RegisterForm = (props) => {
	const [email, setemail] = useState('');
	const [password, setpassword] = useState('');
	const [username, setusername] = useState('');
	const [is_faculty, setis_faculty] = useState(false);
	const [address, setaddress] = useState('');
	const { addToast } = useToasts();
	const history= useHistory();
	return (
		<div className="container">

			<Form className="text-left" onSubmit={async (event) => {
			event.preventDefault();
			const user = { email, password, username, is_faculty, address };
			await fetch('/register/', {
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
						history.push('/loginpage');
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
			<FormGroup check>
					<Label check>
						<Input type="checkbox" id="faculty" name="faculty"
							value={is_faculty}
							onChange={e => setis_faculty(!is_faculty)} />
          Faculty
        </Label>

			</FormGroup>
			<Button type="submit" className="sub-btn" value="submit" color="primary" block>Sign Up</Button>
		</Form>
		</div>
	);
}