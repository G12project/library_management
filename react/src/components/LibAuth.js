import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button, Container, Row, Col } from 'reactstrap';
import '../styles/loginform.css';
import { useToasts } from 'react-toast-notifications';

export const LibLoginForm = (props) => {
	const [email, setemail] = useState('');
	const [password, setpassword] = useState('');
	// const [error, seterror] = useState('');
	const history = useHistory();
	const { addToast } = useToasts();
	return (
		<Container>
			<Row>
				<Col sm="12" md={{ size: 4, offset: 4 }} style={{ marginTop: "20px"}}>
				<h4>Librarian?</h4></Col>
			<Col sm="12" md={{ size: 4, offset: 4 }} style={{color: "white", background: "rgb(31, 29, 29)", paddingBottom: "30px", minHeight: "450px" }}>
			<Form style={{marginTop:"50px"}} onSubmit={async (event) => {
				event.preventDefault();
				const user = { email, password };
				await fetch('/liblogin', {
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
								props.set_is_lib(true);
								props.setuser(responseJson['user']);
								const storeuser = { user: responseJson['user'], type: "lib" };
								localStorage.setItem("user", JSON.stringify(storeuser));
								console.log(responseJson['user']);
								history.push('/library/home');
							})
						}
						else {
							response.json().then((responseJson) => {
								console.log(responseJson.message)
								addToast(responseJson.message, {
									appearance: 'info',
									autoDismiss: true,
									autoDismissTimeout: 8000,
								})
							})
						}
					})
			}}>
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
						<Button type="submit" value="submit" className="sub-btn" color="primary" block>Sign In</Button>
					</Form>
		</Col></Row></Container>
	);
}