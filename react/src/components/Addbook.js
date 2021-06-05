import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';
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
    return(
		<div className="container">
			<Form className="text-left"  onSubmit={async (event) => {
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

						})
					}
					else{
						addToast("Error", {
							appearance: 'info',
							autoDismiss: true,
							autoDismissTimeout: 8000,
							placement: 'bottom-left'
						})
					}

				})
			}}>
			<FormGroup row>
			<Col md="4">
				<Label htmlFor="isbn_no">isbn_no</Label>
				</Col>
				<Col md="12">
				<Input type="text" id="isbn_no" name="isbn_no"
					value={isbn_no}
					onChange={e => setisbn_no(e.target.value)} />
					</Col>
			</FormGroup>
			<FormGroup row>
			<Col md="4">
				<Label htmlFor="title">Title</Label>
				</Col>
				<Col md="12">
				<Input type="text" id="title" name="title"
					value={title}
					onChange={e => settitle(e.target.value)} />
					</Col>
			</FormGroup>
            <FormGroup row>
			<Col md="4">
				<Label htmlFor="author">Author</Label>
				</Col>
				<Col md="12">
				<Input type="text" id="author" name="author"
					value={author}
					onChange={e => setauthor(e.target.value)} />
					</Col>
			</FormGroup>
            <FormGroup row>
			<Col md="4">
				<Label htmlFor="yob">Year of Publication</Label>
				</Col>
				<Col md="12">
				<Input type="number" id="yob" name="yob"
					value={yop}
					onChange={e => setyob(e.target.value)} />
					</Col>
			</FormGroup>
            <FormGroup row>
			<Col md="4">
				<Label htmlFor="genre">Genre</Label>
				</Col>
				<Col md="12">
				<Input type="text" id="genre" name="genre"
					value={genre}
					onChange={e => setgenre(e.target.value)} />
					</Col>
			</FormGroup>
            <FormGroup row>
			<Col md="4">
				<Label htmlFor="copy_no">copy_no</Label>
				</Col>
				<Col md="12">
				<Input type="number" id="copy_no" name="copy_no"
					value={copy_no}
					onChange={e => set_copy_no(e.target.value)} />
					</Col>
			</FormGroup>
            <FormGroup row>
			<Col md="4">
				<Label htmlFor="shelfno">Shelfno</Label>
				</Col>
				<Col md="12">
				<Input type="number" id="shelfno" name="shelfno"
					value={shelf_id}
					onChange={e => setshelfno(e.target.value)} />
					</Col>
			</FormGroup>
            <FormGroup row>
			<Col md="4">
            <Label htmlFor="image">Image</Label>
			</Col>
			<Col md="12">
            <Input type="file"
                   id="image"
                   accept="image/png, image/jpeg"
						onChange={(e) => setimage(e.target.files[0])} required className="file-custom"/>
						</Col>
            </FormGroup>

            <Button type="submit" value="submit" color="primary">Addbooks</Button>
        </Form>
        </div>

    );
}