import React, {useState, useEffect} from 'react';
import { Switch, Route, Redirect} from 'react-router-dom'
import { Home } from './HomeComponent';
import { BookDetail } from './Book_Detail';
import { OnHoldList } from './On_Hold_List';
import { OnLoanList } from './On_Loan_List';
import { PersonalShelfList } from './Personal_Shelf';
import { MyReviewsList } from './My_Reviews_List';
import { Friends } from './Friends';
import { Header } from './HeaderComponent';
import { AuthForms } from './AuthForms';
import { PrivateRoute } from './PrivateRoute'
import { LibLoginForm } from './LibAuth';
import { Addbook } from './Addbook';

export const Main = () => {
	const [user, setuser] = useState('');
	const [is_authenticated, set_is_authenticated] = useState(false);
	const [is_initialized, set_is_initialised] = useState(false);
	const [is_lib, set_is_lib] = useState(false);
	useEffect(() => {
		// localStorage.removeItem("user");
		const loggedInUser = localStorage.getItem("user");
		if (loggedInUser) {
			console.log("loged");
			console.log(JSON.parse(loggedInUser));
			const founduser=JSON.parse(loggedInUser);
			setuser(founduser['user']);
			set_is_authenticated(true);
			if(founduser['type']){
				set_is_lib(true);
			}
		}
		set_is_initialised(true);
	}, [is_authenticated]);
	return(
		<div>
			<Header is_authenticated={is_authenticated} set_is_authenticated={set_is_authenticated} is_lib={is_lib} />
			<Switch>
				<Route path='/loginpage' component={()=>< AuthForms set_is_authenticated={set_is_authenticated} setuser={setuser} is_authenticated={is_authenticated} user={user}/>} />
				<Route exact path='/home' component={() => < Home user={user} is_authenticated={is_authenticated} is_lib={is_lib}/>} />
				<Route exact path='/home/detail/:isbn' component={() => < BookDetail is_authenticated={is_authenticated} />} />
				<PrivateRoute exact path='/list/onhold' is_authenticated={is_authenticated} is_initialized={is_initialized} component={OnHoldList} />
				<PrivateRoute exact path='/list/onloan' is_authenticated={is_authenticated} is_initialized={is_initialized} component={OnLoanList} />
				<PrivateRoute exact path='/list/shelf' is_authenticated={is_authenticated} is_initialized={is_initialized} component={PersonalShelfList} />
				<PrivateRoute exact path='/reviews' is_authenticated={is_authenticated} is_initialized={is_initialized} component={MyReviewsList} />
				<PrivateRoute exact path='/friends' is_authenticated={is_authenticated} is_initialized={is_initialized} component={Friends} />
				<Route exact path='/library/login' component={() => < LibLoginForm set_is_authenticated= { set_is_authenticated } setuser={setuser} set_is_lib={set_is_lib}/>} />
				<Route exact path='/library/add' component={() => < Addbook />} />
				{/* <Route exact path='/aboutus' component={() => <About leaders={this.props.leaders} />} />
				<Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
				<Route path='/menu/:dishId' component={DishWithId} />
				<Route exact path='/contactus' component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} postFeedback={this.props.postFeedback} />} /> */}
				<Redirect to='/home' />
			</Switch>
		</div>
	)

}