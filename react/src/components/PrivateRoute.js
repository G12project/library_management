import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export const PrivateRoute = (props) => {
	// const isLoggedIn = AuthService.isLoggedIn()
	is_authenticated=props.is_authenticated
	return (
		<Route
			render={props =>
				is_authenticated ? (
					<Component {...props.component} />
				) : (
						<Redirect to={{ pathname: '/loginpage', state: { from: props.location } }} />
					)
			}
		/>
	)
}