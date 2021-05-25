import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';

export const LoginForm = (props)=>{
	const[email,setemail]=useState('');
	const[password, setpassword]= useState('');
	const history=useHistory();
	return(
		<Form onSubmit={async (event) => {
			event.preventDefault();
			const user = { email, password };
			await fetch('/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			}).then(
				(response) => response.json()).then((responseJson) => {
					if(responseJson['logged']==='Y'){
						console.log("OK");
						props.set_is_authenticated(true);
						props.setuser(responseJson['user']);
						const storeuser={user: responseJson['user']};
						localStorage.setItem("user", JSON.stringify(storeuser));
						console.log(responseJson['user']);
					}
					history.push('/home');
				})
		}}>
			<FormGroup>
				<Label htmlFor="email">Email</Label>
				<Input type="text" id="email" name="email"
					value={email}
					onChange={e =>setemail(e.target.value)} />
			</FormGroup>
			<FormGroup>
				<Label htmlFor="password">Pass</Label>
				<Input type="text" id="password" name="password"
					value={password}
					onChange={e => setpassword(e.target.value)} />
			</FormGroup>
			<Button type="submit" value="submit" color="primary">Login</Button>
		</Form>
	);
}