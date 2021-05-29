import React from 'react';
import { Navbar, Nav, NavItem, NavbarBrand } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export const Lists = ()=> {
	return(
		<div>
			<Navbar light className="bg-light" expand="md">
				<div className="container">
					{/* <NavbarToggler onClick={()=>setNav(!isNavOpen)} />
					<NavbarBrand className="mr-auto" href="/"></NavbarBrand>
					<Collapse isOpen={isNavOpen} navbar> */}
						<Nav navbar>
						<NavItem>
							<NavLink className="nav-link" to='/list/onhold'
								activeStyle={{
									fontWeight: "bold",
									textDecoration: "underline solid",
									color: "#1a8cff"
								}}><span className="fa fa-list fa-lg"></span> Hold</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="nav-link" to='/list/onloan'
								activeStyle={{
									fontWeight: "bold",
									textDecoration: "underline solid",
									color: "#1a8cff"
								}}><span className="fa fa-list fa-lg"></span> Loans</NavLink>
						</NavItem>
						<NavItem>
							<NavLink className="nav-link" to='/list/shelf'
								activeStyle={{
									fontWeight: "bold",
									textDecoration: "underline solid",
									color: "#1a8cff"
								}}><span className="fa fa-list fa-lg"></span> Shelf</NavLink>
						</NavItem>
						{/* <NavItem>
							<NavLink className="nav-link" to='/contactus'><span className="fa fa-address-card fa-lg"></span> Contact Us</NavLink>
						</NavItem> */}
						</Nav>
					{/* </Collapse> */}
			{/* <Nav className="ml-auto" navbar>
							<NavItem>
								<Button outline onClick={this.toggleModal}><span className="fa fa-sign-in fa-lg"></span> Logout</Button>
							</NavItem>
						</Nav> */}
				</div>
			</Navbar>
		</div>
	);
}
