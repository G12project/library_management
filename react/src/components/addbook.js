import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';


export const addbook = (props)=>{
    const[isbn_no,setisbn_no]=useState('');
    const[title,settitle]=useState('');
    const[author,setauthor]=useState('');
    const[yob,setyob]=useState('');
    const[ genre,setgenre]=useState('');
    const[copy_no,set_copy_no]=useState('');
    const[shelfno,setshelfno]=useState('');
    const[image,setimage]=useState('');
    return(
        <div>
            		<Form onSubmit={async (event) => {
			event.preventDefault();
			const bookdetail = {isbn_no,title,author,yob,genre,copy_no,shelfno,image};
			await fetch('/addbook', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(bookdetail)
			}).then(
				(response) =>{ if(response.status===201){response.json().then((responseJson) => {
					console.log(responseJson.message)
					console.log(responseJson)
					
					})
				}
				else{
					console.log("Error");
				}

			})
		}}>
            	<FormGroup>
				<Label htmlFor="isbn_no">isbn_no</Label>
				<Input type="number" id="isbn_no" name="isbn_no"
					value={isbn_no}
					onChange={e => setisbn_no(e.target.value)} />
			</FormGroup>
			<FormGroup>
				<Label htmlFor="title">Title</Label>
				<Input type="text" id="title" name="title"
					value={title}
					onChange={e => settitle(e.target.value)} />
			</FormGroup>
            <FormGroup>
				<Label htmlFor="author">Author</Label>
				<Input type="text" id="author" name="author"
					value={author}
					onChange={e => setauthor(e.target.value)} />
			</FormGroup>
            <FormGroup>
				<Label htmlFor="yob">Year of Publication</Label>
				<Input type="date" id="yob" name="yob"
					value={yob}
					onChange={e => setyob(e.target.value)} />
			</FormGroup>
            <FormGroup>
				<Label htmlFor="genre">Genre</Label>
				<Input type="text" id="genre" name="genre"
					value={genre}
					onChange={e => setgenre(e.target.value)} />
			</FormGroup>
            <FormGroup>
				<Label htmlFor="copy_no">copy_no</Label>
				<Input type="number" id="copy_no" name="copy_no"
					value={copy_no}
					onChange={e => set_copy_no(e.target.value)} />
			</FormGroup>
            <FormGroup>
				<Label htmlFor="shelfno">Shelfno</Label>
				<Input type="number" id="shelfno" name="shelfno"
					value={shelfno}
					onChange={e => setshelfno(e.target.value)} />
			</FormGroup>
            <FormGroup>
            <Label htmlFor="image">Image</Label>
            <Input type="file"
                   id="image"
                   accept="image/png, image/jpeg" value={image}
                   onChange={e => setimage(e.target.value)}   required/>
            </FormGroup>
			
            <Button type="submit" value="submit" color="primary">Addbooks</Button>
        </Form>
        </div>

    );
}