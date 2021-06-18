import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Form, FormGroup, Input, Label, Button, Media, Row, Col,Table, Container,Modal, ModalBody, ModalHeader, ModalFooter, ButtonGroup} from 'reactstrap';
import StarRatings from 'react-star-ratings';
import { useToasts } from 'react-toast-notifications';

function PersonalShelfButton({sh, is_authenticated, isbn, history, addToast, setnewreview}){
	console.log(sh);
	if(!sh){
		return(
			<Button outline color="success" onClick={() => {
				if (!is_authenticated) {
					addToast("Login to continue", {
						appearance: 'error',
						autoDismiss: true,
						autoDismissTimeout: 8000,
						placement: 'bottom-left'
					}); history.push('/loginpage'); }
				else {
					fetch('/homedata/shelf/add/' + isbn).then(response =>
						response.json().then(res => {
							console.log(res.message)
							addToast(res.message, {
								appearance: 'info',
								autoDismiss: true,
								autoDismissTimeout: 8000,
								placement: 'bottom-left'
							})
							history.push('/list/shelf')
						})
					)
				}
			}}>Shelf</Button>
		);
	}
	else {
		return(
			<Button outline color="success" onClick={() => {
				if (!is_authenticated) {
					addToast("Login to continue", {
						appearance: 'error',
						autoDismiss: true,
						autoDismissTimeout: 8000,
						placement: 'bottom-left'
					}); history.push('/loginpage');  }
				else {
					fetch('/homedata/shelf/remove/' + isbn).then(response =>
						response.json().then(res => {
							console.log(res.message)
							addToast(res.message, {
								appearance: 'info',
								autoDismiss: true,
								autoDismissTimeout: 8000,
								placement: 'bottom-left'
							})
							setnewreview(true);
						})
					)
				}
			}}>UnShelf</Button>
		);
	}
}
function ShowDetail({reviews}){
	return(
		<Media middle>
		<Media heading>
		<StarRatings
					rating={reviews.rating}
					starDimension="25px"
					starSpacing="5px"
					starRatedColor="#ffff00"
				/>
		</Media>
		<Media heading>
			{reviews.user}
		</Media>
		<Media body>
        {reviews.review}
    	</Media>
		</Media>
	);
}

export const BookDetail = (props) =>{
	let { isbn } = useParams();
	let url='/homedata/'+isbn;
	const history= useHistory();
	console.log(url);
	const [book, setbook]=useState();
	const [reviews, setreviews] =useState();
	const [rating, setrating]=useState(0);
	const [review, setreview]=useState('');
	const [newreview, setnewreview] = useState(false);
	const [title, settitle] = useState('');
	const [author, setauthor] = useState('');
	const [yop, setyob] = useState('');
	const [genre, setgenre] = useState('');
	const [q, setQ] = useState(false);
	const { addToast } = useToasts();
	const toggle = () => {
		settitle(book.title);
		setyob(book.year_of_pub);
		setauthor(book.author);
		setgenre(book.genre);
		setQ(!q);
	}
	useEffect(()=>{
		let mounted=true;
		console.log("IN");
		fetch(url).then(response =>
			response.json().then(data => {
				console.log(data.bookdetail);
				console.log(data.reviews);
				if (mounted){
					setbook(data.bookdetail);
					data.reviews.reverse();
					setreviews(data.reviews);
				}
			})
		);
		return function cleanup() {
			mounted = false;
		}
	}, [url, newreview]);
	if (book && reviews && !props.is_lib) {
		const reviewlist  = reviews.map((review) =>{
			return (
				<ShowDetail reviews={review} />
			)
		});
		return(
		<div>
			<Container style={{maxWidth: "100%", marginTop: "30px"}}>
				{/* <Alert color="info" isOpen={visible} toggle={onDismiss}>
						I am an alert and I can be dismissed!
				</Alert> */}
  			<Row>
    			<Col md="4">
				<h3><strong>{book.title}</strong></h3>
				<div><StarRatings
					rating={parseFloat(book.rating)}
					starDimension="25px"
					starSpacing="5px"
					starRatedColor="#ffff00"
				/></div>
				<img height="300" width="300" src={`/static/images/${book.image}`} alt={book.title} />
				</Col>
    			<Col md="8">
				<div>
					<Table key={book.isbn_no}>
						<tbody>
						<tr scope="row">
							<th><strong>Author :</strong></th>
							<th>{book.author}</th>
						</tr>
						<tr>
							<th><strong>Year of Publication :</strong></th>
							<th>{book.year_of_pub}</th>
						</tr>
						<tr>
							<th><strong>Genre :</strong></th>
							<th>{book.genre}</th>
						</tr>
						</tbody>
						</Table>
						<ButtonGroup>
						<Button outline color="success" onClick={()=>{
												if (!props.is_authenticated) {
													addToast("Login to continue", {
														appearance: 'error',
														autoDismiss: true,
														autoDismissTimeout: 8000,
														placement: 'bottom-left'
													}); history.push('/loginpage');  }
								else{
										fetch('/homedata/hold/'+isbn).then(response =>
										response.json().then((res)=>{
											console.log(res.message)
											addToast(res.message, {
												appearance: 'info',
												autoDismiss: true,
												autoDismissTimeout: 8000,
												placement: 'bottom-left'
											})
											history.push('/list/onhold')
										})
									)
								}
							}}>Hold</Button>
							<Button outline color="success" onClick={()=>{
								if(!props.is_authenticated) {addToast("Login to continue", {
									appearance: 'error',
									autoDismiss: true,
									autoDismissTimeout: 8000,
									placement: 'bottom-left'
								}); history.push('/loginpage'); }
								else{
									fetch('/homedata/loan/'+isbn).then(response =>
										response.json().then(res=> {
											console.log(res.message);
											addToast(res.message, {
												appearance: 'info',
												autoDismiss: true,
												autoDismissTimeout: 8000,
												placement: 'bottom-left'
											})
											history.push('/list/onloan');
										})
									)
								}
							}}>Borrow</Button>
								<PersonalShelfButton sh={book.shelf} is_authenticated={props.is_authenticated} is_lib={props.is_lib} isbn={isbn} history={history} addToast={addToast} setnewreview={setnewreview}/>
						</ButtonGroup>
						<div style={{marginTop: "20px"}}>
						<h5>Rate this book</h5>
					<Form onSubmit={async (event) => {
					event.preventDefault();
					if(!props.is_authenticated) {addToast("Login to continue", {
						appearance: 'error',
						autoDismiss: true,
						autoDismissTimeout: 8000,
						placement: 'bottom-left'
						}); history.push('/loginpage'); }
					const data = { rating, review};
					await fetch('/homedata/review/'+isbn, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(data)
					}).then(
						response =>
							response.json().then(res=>{
								console.log(res.message);
								setreview('');
								setrating(0);
								setnewreview(!newreview);
							})
					)
				}}>
					<FormGroup>
						{/* <Label htmlFor="rating">Rating</Label> */}
						{/* <Input type="number" id="rating" name="rating"
							value={rating}
							onChange={e => setrating(e.target.value)} /> */}
						<StarRatings
						rating={rating}
						starDimension="25px"
							starSpacing="5px"
							starRatedColor="#ffff00"
							changeRating={(rating) => setrating(rating)}
							required
						name='rating'
						/>
					</FormGroup>
					<FormGroup row>
						<Col md="6">
						<Input type="textarea" id="review" name="review"
							value={review}
							onChange={e => setreview(e.target.value)}/></Col>
					</FormGroup>
					<Button type="submit" value="submit" color="primary" style={{marginTop: "10px"}}>Submit</Button>
				</Form>
				</div>
				</div>
				</Col>
  			</Row>
				</Container>
				<Container>{reviewlist}</Container>

		</div>



		);
	}
	else if(props.is_lib && book && reviews){
		const reviewlist = reviews.map((review) => {
			return (
				<ShowDetail reviews={review} />
			)
		});
		return (
		<div>
			<Container>
				{/* <Alert color="info" isOpen={visible} toggle={onDismiss}>
						I am an alert and I can be dismissed!
				</Alert> */}
				<Row>
					<Col>
						<h3><strong>{book.title}</strong></h3>
						<img height="300" width="300" src={`/static/images/${book.image}`} alt={book.title} />
					</Col>
					<Col>
						<div><StarRatings
							rating={parseFloat(book.rating)}
							starDimension="25px"
							starSpacing="5px"
							starRatedColor="#ffff00"
						/></div>
						<div>
							<Table key={book.isbn_no}>
								<tbody>
										<tr>
											<th><strong>Author :</strong></th>
											<th>{book.author}</th>
										</tr>
									<tr>
										<th><strong>Year of Publication :</strong></th>
										<th>{book.year_of_pub}</th>
									</tr>
									<tr>
										<th><strong>Genre :</strong></th>
										<th>{book.genre}</th>
									</tr>
									<tr><td>

									<Button color="primary" onClick={toggle}>Edit</Button></td></tr>
								</tbody>
							</Table>
						</div>
						<div>
							<Modal isOpen={q} toggle={toggle}>
								<ModalHeader toggle={toggle}><h2>User</h2></ModalHeader>
								<ModalBody>
										<Form onSubmit={() => {
											let edit = new FormData();
											edit.append('isbn_no', book.isbn_no);
											edit.append('title', title);
											edit.append('author', author);
											edit.append('yop', yop);
											edit.append('genre', genre);
											fetch('/addbooks', {
												method: 'POST',
												// headers: {
												// 	'Content-Type': 'application/json'
												// },
												body: edit
											}).then(response =>
												response.json().then(
													data => {
														addToast(data.message, {
															appearance: 'info',
															autoDismiss: true,
															autoDismissTimeout: 8000,
														});
														setnewreview(!newreview);
													})
											)
										}}>
										<Label for="title" id="title">Title</Label>
										<Input id="title" name="title" value={title} onChange={(e)=>settitle(e.target.value)} />
										<Label for="author" id="author">Author</Label>
										<Input id="author" name="author" value={author} onChange={(e) => setauthor(e.target.value)} />
										<Label for="yob" id="yob">Year of Publication</Label>
										<Input id="yob" name="yob" value={yop} onChange={(e) => setyob(e.target.value)} />
										<Label for="genre" id="genre">Genre</Label>
										<Input id="genre" name="genre" value={genre} onChange={(e) => setgenre(e.target.value)} />
										<Button type="submit" outline color="success">Submit</Button>
									</Form>
									</ModalBody>
									<ModalFooter>
									<Button color="primary" onClick={toggle}>Cancel</Button>
								</ModalFooter>
							</Modal>
						</div>
						</Col>
  				</Row>
			</Container>
			<Container>{reviewlist}</Container>
		</div>
		);
	}
	else {
		return null;
	}
}