import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Form,ListGroup, ListGroupItem, Badge, FormGroup, Input, Label, Button } from 'reactstrap';

export const Friends = (props) => {
	const [friends, setfriends] = useState();
	const [userres, setuserres] = useState([]);
	const [newfriend, setnewfriend]= useState(false);
	const [q, setQ] = useState('');
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
				})
			)
		return function cleanup() {
			mounted = false;
		}

	}, [newfriend,q]);
	if (friends) {
		const friendlist = friends.map((friend) => {
			return (
				<ListGroup>
				<ListGroupItem className="justify-content-between">{friend.name}</ListGroupItem>
				<Badge color="dark" pill>
				<Button onClick={()=>{
					fetch('/homedata/user/shelf/'+friend.user_id).then(response=>
						response.json().then(
							data => console.log(data.friend_shelf)
						)
					)
				}}>See Shelf</Button>
				</Badge>
			</ListGroup>
			)
		});
		let res;
		if (q==''){
			res=null;
		}
		else{
		 res = userres.filter((user)=>user.name.toLowerCase().indexOf(q)>-1).map((user) => {
			return (
				<ListGroup>
					<ListGroupItem className="justify-content-between">{user.name}</ListGroupItem>
					{/* <Badge color="dark" pill>
					<Button onClick={() => {
						fetch('/homedata/friend/'+user.user_id).then(response =>
							response.json().then(
								data => {console.log(data.message)
								setnewfriend(!newfriend)
							})
						)
					}}>Add as Friend</Button>
					</Badge> */}
				</ListGroup>
			)
		});
	}
		return (
			<div>
				<div className="search"><input type="text" placeholder="search" value={q} onChange={(e)=>setQ(e.target.value)}/></div>
				{/* <Form >
					<FormGroup>
						<Label htmlFor="user">Search User</Label>
						<Input type="text" id="user" name="user"
							value={user} required
							onChange={e => setuser(e.target.value)} />
					</FormGroup>
					<Button type="submit" value="submit" color="primary">Find</Button>
				</Form> */}
				<div>
					<p>Users</p>
					{res}
				</div>
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