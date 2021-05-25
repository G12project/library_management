import React, {useState, useEffect} from 'react';
import { Switch, Route, Redirect} from 'react-router-dom'
import { LoginForm } from './LoginForm';
import { Home } from './HomeComponent';
import { BookDetail } from './Book_Detail';

export const Main = () => {
	const [user, setuser] = useState('');
	const [is_authenticated, set_is_authenticated] = useState(false);
	const [data, setdata] = useState([]);
	useEffect(() => {
		// localStorage.removeItem("user");
		const loggedInUser = localStorage.getItem("user");
		if (loggedInUser) {
			console.log("loged");
			console.log(JSON.parse(loggedInUser));
			const founduser=JSON.parse(loggedInUser);
			setuser(founduser['user']);
			set_is_authenticated(true);
		}
		fetch('/homedata').then(response =>
			response.json().then(data => {
				console.log(data.data);
				setdata(data.data);
			})
		);
	}, []);
	return(
		<div>
			<Switch>
				<Route path='/loginpage' component={()=>< LoginForm set_is_authenticated={set_is_authenticated} setuser={setuser}/>} />
				<Route exact path='/home' component={() => < Home user={user} is_authenticated={is_authenticated} data={data}/>} />
				<Route exact path='/home/:isbn' component={() => < BookDetail />} />
				{/* <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />
				<Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
				<Route path='/menu/:dishId' component={DishWithId} />
				<Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} /> */}
				<Redirect to="/home" />
			</Switch>
		</div>
	)

}