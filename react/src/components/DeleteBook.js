import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';


export const Deletebook = ()=>{
    const[isbn_no,setisbn_no]=useState('');
	const[copy_no,set_copy_no]=useState('');
	const[all,setall]=useState(false);
	const { addToast } = useToasts();
    return(
		<div>
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
			<FormGroup>
				<Label htmlFor="isbn_no">Isbn no</Label>
				<Input type="text" id="isbn_no" name="isbn_no"
					value={isbn_no}
					onChange={e => setisbn_no(e.target.value)} />
			</FormGroup>
			<FormGroup>
					<Label htmlFor="all">All Copies?</Label>
					<Input type="checkbox" id="all" name="all"
						value={all}
						onChange={e => setall(!all)} />
			</FormGroup>
            <FormGroup>
				<Label htmlFor="copy_no">Copy no</Label>
				<Input type="number" id="copy_no" name="copy_no"
					value={copy_no}
					onChange={e => set_copy_no(e.target.value)}  disabled={all}/>
			</FormGroup>
            <Button type="submit" value="submit" color="primary">Delete</Button>
        </Form>
        </div>

    );
}