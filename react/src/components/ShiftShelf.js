import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';


export const Shiftshelf = ()=>{
    const[isbn_no,setisbn_no]=useState('');
	const[copy_no,set_copy_no]=useState('');
	const[shelf_id,set_shelf_id]=useState('');
	const { addToast } = useToasts();
    return(
		<div className="container">
			<Form className="text-left" onSubmit={async (event) => {
			event.preventDefault();

				const book={isbn_no, copy_no, shelf_id};
				await fetch('/shiftshelf', {
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
					}
					else{
						addToast("Error", {
							appearance: 'info',
							autoDismiss: true,
							autoDismissTimeout: 8000
						})
					}

				})
			}}>
			<FormGroup row>
			<Col md="4">
				<Label htmlFor="isbn_no">Isbn no</Label>
				</Col>
				<Col md="12">
				<Input type="text" id="isbn_no" name="isbn_no"
					value={isbn_no}
					onChange={e => setisbn_no(e.target.value)} />
					</Col>
			</FormGroup>
			{/* <FormGroup>
					<Label htmlFor="all">All Copies?</Label>
					<Input type="checkbox" id="all" name="all"
						value={all}
						onChange={e => setall(!all)} />
			</FormGroup> */}
            <FormGroup row>
			<Col md="4">
				<Label htmlFor="copy_no">Copy No</Label>
				</Col>
				<Col md="12">
				<Input type="number" id="copy_no" name="copy_no"
					value={copy_no}
					onChange={e => set_copy_no(e.target.value)}/>
					</Col>
			</FormGroup>
			<FormGroup row>
			<Col md="4">
				<Label htmlFor="shelfno">Shelf No</Label>
				</Col>
				<Col md="12">
				<Input type="number" id="shelfno" name="shelfno"
					value={shelf_id}
					onChange={e => set_shelf_id(e.target.value)} />
					</Col>
			</FormGroup>
            <Button type="submit" value="submit" color="primary">Delete</Button>
        </Form>
        </div>

    );
}