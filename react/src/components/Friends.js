import React, { useState, useEffect } from 'react';
import { Container, Row, Col,ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

function Add({q, setnewfriend, newfriend, toggle, revcount, friendscnt, shelfcnt}){
	return (
		<div>
			<Modal isOpen={q} toggle={toggle}>
				<ModalHeader toggle={toggle}><h2>User</h2></ModalHeader>
				<ModalBody>
					<strong>Username: {q.name}</strong><br/>
					<strong>Reviews: </strong> {revcount}<br/>
					<strong>Books in Shelf: </strong> {shelfcnt}<br />
					<strong>Friends: </strong> {friendscnt}<br />
			</ModalBody>
				<ModalFooter>
					<Button color="white" onClick={() => {
						fetch('/homedata/friend/' + q.user_id).then(response =>
							response.json().then(
								data => {
									console.log(data.message)
									setnewfriend(!newfriend)
									toggle();
								})
						)
					}}><span className="fas fa-user-plus" style={{color:"green"}}></span></Button>
					<Button color="white" onClick={toggle}><span style={{ color: "red" }} className="far fa-window-close"></span></Button>
				</ModalFooter>
			</Modal>
		</div>
	)
}

function Show({shelf, toggle2}){
	const books =shelf.map((shelf) => {
		return(
			<div>

      <ListGroupItem>
		  <Row>
			  <Col md="3"><img src={`/static/images/${shelf.image}`} width={100} height={100} /></Col>
			  <Col>
		  <ListGroup>
			  <ListGroupItem>
						<Link to={`/home/detail/${shelf.isbn_no}`}>{shelf.title}</Link>
			  </ListGroupItem>
			  <ListGroupItem>Author: {shelf.author}</ListGroupItem>
			  <ListGroupItem>Genre: {shelf.genre}</ListGroupItem>
			</ListGroup>
			</Col>
			</Row>
		</ListGroupItem>

			</div>
		);
	})
	return (
		<div>
			<Modal isOpen={shelf} toggle2={toggle2}>
				<ModalHeader toggle={toggle2}><h2>User Shelf</h2></ModalHeader>
				<ModalBody>
					<ListGroup>{books}</ListGroup>

			</ModalBody>
			</Modal>
		</div>
	)



}

export const Friends = (props) => {
	const [friends, setfriends] = useState();
	const [userres, setuserres] = useState([]);
	const [revcount, setrevcount] =useState([]);
	const [friendscount, setfriendscount] = useState([]);
	const [shelfcount, setshelfcount] = useState([]);
	const [newfriend, setnewfriend]= useState(false);
	const [q, setQ] = useState(null);
	const [rev, setrev]=useState(0);
	const [friendscnt, setfriendscnt]= useState(0);
	const [shelfcnt, setshelfcnt]=useState(0);
	const [shelf,setshelf]=useState(null);

	const toggle = () => setQ(null);
	const toggle2 = () => setshelf(null);
	useEffect(() => {
		let mounted = true;
		fetch('/homedata/friends').then(response =>
			response.json().then(data => {
				console.log(data.friends);
				if (mounted)
					setfriends(data.friends);
			})
		);

			fetch('/homedata/users').then(
				(response) => response.json().then(data => {
					console.log(data.users);
					setuserres(data.users);
					setrevcount(data.revcount);
					setfriendscount(data.friendscount);
					setshelfcount(data.shelfcount);

				})
			)
		return function cleanup() {
			mounted = false;
		}

	}, [newfriend]);
	if (friends && userres) {
		const friendlist = friends.map((friend) => {
			return (
				<ListGroup>
				<ListGroupItem className="justify-content-between">{friend.name}
					<Button color="link" onClick={()=>{
					fetch('/homedata/user/shelf/'+friend.user_id).then(response=>
						response.json().then(
							data => {
								console.log(data.friend_shelf)
								setshelf(data.friend_shelf)
							}
						)
					)
						}}><span className="fa fa-book"></span></Button>
				<Button color="white" onClick={()=>{
					fetch('/homedata/friend/remove/'+friend.user_id).then(response=>
						response.json().then(
							data => {
								setnewfriend(!newfriend)
							}
						)
					)
						}}><span className="fas fa-user-minus" style={{color: "red"}}></span></Button>
						{shelf && <Show toggle2={toggle2} shelf={shelf} />}
				</ListGroupItem>
			</ListGroup>
			)
		});
		const filterOptions=createFilterOptions({
			matchFrom: 'start',
			stringify: (option) => option.name,
		})
		return (
			<div >
			<Container style={{marginTop: "50px"}}>
				<Row>
					<Col md="12">
					<h5>User</h5>
					 <Autocomplete
	 				 id="user"
						onChange={(event, value) => { setQ(value);
							if (value && revcount[value.user_id] !== undefined) setrev(revcount[value.user_id]);
							if (value && friendscount[value.user_id] !== undefined) setfriendscnt(friendscount[value.user_id]);
							if(value && shelfcount[value.user_id]!==undefined) setshelfcnt(shelfcount[value.user_id]); } }
						options={userres}
						getOptionLabel={(option) => option.name}
						filterOptions={filterOptions}
						style={{ width: 300 }}
						renderInput={(params) => <TextField {...params} variant="outlined" />}
					 />
					</Col></Row>
					</Container>
					<Container style={{marginTop: "50px"}}>
					{q && <Add q={q} setnewfriend={setnewfriend} newfriend={newfriend} toggle={toggle} revcount={rev} friendscnt={friendscnt} shelfcnt={shelfcnt}/>}
					</Container>
				<div>
					<p>Friends</p>
						{friendlist}
				</div>
			</div>
		);
	}
	else
		return null;
}