import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button, Col, Container, Row} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';


export const Deletebook = ()=>{
    const[isbn_no,setisbn_no]=useState('');
	const[copy_no,set_copy_no]=useState('');
	const[all,setall]=useState(false);
	const { addToast } = useToasts();
	const history=useHistory();
	const reset=()=>{
		setisbn_no('');
		set_copy_no('');
		setall(false);
	}
    return(
		<Container><Row><Col md="4">
			<Form onSubmit={async (event) => {
			event.preventDefault();

				const book={isbn_no, copy_no};
				let url='/delcopy';
				if(all){
					url='/delbook';
				}
				await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(book)
				}).then(
					(response) =>{ if(response.status===201){response.json().then((responseJson) => {
						console.log(responseJson.message)
						addToast(responseJson.message, {
							appearance: 'info',
							autoDismiss: true,
							autoDismissTimeout: 8000
							})
						})
						history.push('/home');
					}
					else{
						addToast("Error", {
							appearance: 'info',
							autoDismiss: true,
							autoDismissTimeout: 8000
						})
						reset();
					}

				})
			}}>
			<FormGroup>
				<Label htmlFor="isbn_no">Isbn_No</Label>
				<Input type="text" id="isbn_no" name="isbn_no" required
					value={isbn_no}
					onChange={e => setisbn_no(e.target.value)}/>
			</FormGroup>
			<FormGroup check>
				<Label for="all">
				<Input type="checkbox" id="all" name="all"
						value={all}
						onChange={e => setall(!all)} />
				All_Copies?
				</Label>
			</FormGroup>
            <FormGroup>
				<Label htmlFor="copy_no">Copy_No</Label>
				<Input type="number" id="copy_no" name="copy_no"
					value={copy_no}
					onChange={e => set_copy_no(e.target.value)} disabled={all}/>
			</FormGroup>
            <Button style={{marginTop:"20px"}} type="submit" value="submit" color="primary">Delete</Button>
        </Form>
		</Col>
        </Row></Container>

    );
}