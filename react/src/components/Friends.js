import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';

export const Friends = (props) => {
	const [friends, setfriends] = useState();
	const [userres, setuserres] = useState([]);
	const [user, setuser] = useState('');
	const [newfriend, setnewfriend]= useState(false)
	useEffect(() => {
		let mounted = true;
		fetch('/homedata/friends').then(response =>
			response.json().then(data => {
				console.log(data.friends);
				if (mounted)
					setfriends(data.friends);
			})
		);
		return function cleanup() {
			mounted = false;
		}
	}, [newfriend]);
	if (friends) {
		const friendlist = friends.map((friend) => {
			return (
				<div>
				{friend.name}
				<Button onClick={()=>{
					fetch('/homedata/user/shelf/'+friend.user_id).then(response=>
						response.json().then(
							data => console.log(data.friend_shelf)
						)
					)
				}}>See Shelf</Button>
				</div>
			)
		});
		const res = userres.map((user) => {
			return (
				<div>
					{user.name}
					<Button onClick={() => {
						fetch('/homedata/friend/'+user.user_id).then(response =>
							response.json().then(
								data => {console.log(data.message)
								setnewfriend(!newfriend)
							})
						)
					}}>Add as Friend</Button>
				</div>
			)
		});
		return (
			<div>
				<Form onSubmit={(event) => {
					event.preventDefault();
					const key = { user};
					fetch('/homedata/users', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(key)
					}).then(
						(response) => response.json().then(data => {
							console.log(data.users);
							setuserres(data.users);
						})
					)
				}}>
					<FormGroup>
						<Label htmlFor="user">Search User</Label>
						<Input type="text" id="user" name="user"
							value={user} required
							onChange={e => setuser(e.target.value)} />
					</FormGroup>
					<Button type="submit" value="submit" color="primary">Find</Button>
				</Form>
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