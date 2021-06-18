import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button, Col, Container, Row} from 'reactstrap';
import { useToasts } from 'react-toast-notifications';


export const Addbook = (props)=>{
    const[isbn_no,setisbn_no]=useState('');
    const[title,settitle]=useState('');
    const[author,setauthor]=useState('');
    const[yop,setyob]=useState('');
    const[ genre,setgenre]=useState('');
    const[copy_no,set_copy_no]=useState('');
    const[shelf_id,setshelfno]=useState('');
	const[image,setimage]=useState(null);
	const { addToast } = useToasts();
	const history=useHistory();
	const reset = () => {
		setisbn_no('');
		settitle('');
		setauthor('');
		setyob('');
		setgenre('');
		set_copy_no('');
		setshelfno('');
		setimage(null);
	}
    return(
		<Container style={{marginTop: "20px"}}>
			<Row><Col md="4">
			<Form onSubmit={async (event) => {
			event.preventDefault();
				let bookdetail = new FormData();
				console.log(isbn_no);
				bookdetail.append('isbn_no', isbn_no);
				bookdetail.append('title', title);
				bookdetail.append('author', author);
				bookdetail.append('yop', yop);
				bookdetail.append('genre', genre);
				bookdetail.append('image', image, image.name);
				bookdetail.append('copy_no', copy_no);
				bookdetail.append('shelf_id', shelf_id);
				await fetch('/addbooks', {
					method: 'POST',
					// headers: {
					// 	'Content-Type': 'multipart/form-data'
					// },
					body: bookdetail
				}).then(
					(response) =>{ if(response.status===201){response.json().then((responseJson) => {
						console.log(responseJson.message)
						console.log(responseJson)
						addToast(responseJson.message, {
							appearance: 'info',
							autoDismiss: true,
							autoDismissTimeout: 8000,
							placement: 'bottom-left'
						})
						history.push('/home');
						})
					}
					else{
						addToast("Error", {
							appearance: 'info',
							autoDismiss: true,
							autoDismissTimeout: 8000,
							placement: 'bottom-left'
						})
						reset();
					}

				})
			}}>
			<FormGroup>
				<Label htmlFor="isbn_no">Isbn_No</Label>
				<Input type="text" id="isbn_no" name="isbn_no"
					value={isbn_no}
					onChange={e => setisbn_no(e.target.value)} required/>
			</FormGroup>
			<FormGroup>
				<Label htmlFor="title">Title</Label>
				<Input type="text" id="title" name="title"
					value={title}
					onChange={e => settitle(e.target.value)} required/>
			</FormGroup>
			<FormGroup>
				<Label htmlFor="author">Author</Label>
				<Input type="text" id="author" name="author"
					value={author}
					onChange={e => setauthor(e.target.value)} required/>
			</FormGroup>
			<FormGroup>
				<Label htmlFor="yob">Year_of_Publication</Label>
				<Input type="number" id="yob" name="yob"
					value={yop}
					onChange={e => setyob(e.target.value)} required/>
			</FormGroup>
			<FormGroup>
				<Label htmlFor="genre">Genre</Label>
				<Input type="text" id="genre" name="genre"
					value={genre}
					onChange={e => setgenre(e.target.value)} required/>

			</FormGroup>
			<FormGroup>
				<Label htmlFor="copy_no">Copy_No</Label>
				<Input type="number" id="copy_no" name="copy_no"
					value={copy_no}
					onChange={e => set_copy_no(e.target.value)} required/>

			</FormGroup>
			<FormGroup>
				<Label htmlFor="shelfno">Shelf_No</Label>

				<Input type="number" id="shelfno" name="shelfno"
					value={shelf_id}
					onChange={e => setshelfno(e.target.value)} required/>

			</FormGroup>
			<FormGroup>
			<Label htmlFor="image">Image</Label>
			<Input type="file"
				id="image"
				accept="image/png, image/jpeg"
						onChange={(e) => setimage(e.target.files[0])} required className="file-custom"/>

			</FormGroup>

			<Button type="submit" value="submit" color="primary">Add</Button>
		</Form>
		</Col></Row>
	</Container>

    );
}