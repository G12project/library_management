import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { useHistory } from 'react-router-dom';


export const Header = (props)=> {
      const[isNavOpen, setNav]=useState(false)
      const history = useHistory();
      function logout (){
        props.set_is_authenticated(false);
        props.set_is_lib(false);
        localStorage.clear();
        fetch('/logout').then(
            (response) =>{ if(response.status===201){response.json().then((responseJson) => {
                console.log(responseJson.message)
                history.push('/')
                })
            }
            else{
                console.log("Error");
            }

        })
      }

if(!props.is_authenticated){
    return (
        <div>
            <Navbar dark className="bg-dark" expand="md">
                <div className="container">
                    <NavbarToggler onClick={() => setNav(!isNavOpen)} />
                    <NavbarBrand className="mr-auto" href="/"></NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink className="nav-link" to='/loginpage'><span className="fa fa-sign-in fa-lg"></span> Sign In</NavLink>
                        </NavItem>
                    </Nav>
                </div>
            </Navbar>
        </div>
    );

}
else if(!props.is_lib){
    return (
        <div>
            <Navbar dark className="bg-dark" expand="md">
                <div className="container">
                    <NavbarToggler onClick={() => setNav(!isNavOpen)} />
                    <NavbarBrand className="mr-auto" href="/"></NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/list/shelf'><span className="fa fa-info fa-lg"></span> Lists</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/friends'><span className="fa fa-list fa-lg"></span> Friends</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/reviews'><span className="fa fa-address-card fa-lg"></span>Reviews</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Button outline onClick={logout}><span className="fa fa-sign-in fa-lg"></span> Logout</Button>
                        </NavItem>
                    </Nav>
                </div>
            </Navbar>
        </div>
    );

}
else{
    return(
        <div>
            <Navbar dark className="bg-dark" expand="md" style={{marginBottom : "50px"}}>
                <div className="container">
                    <NavbarToggler onClick={() => setNav(!isNavOpen)} />
                    <NavbarBrand className="mr-auto" href="/"></NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link" to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/library/add'><span className="fa fa-info fa-lg"></span> Add Book</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/library/delete'><span className="fa fa-list fa-lg"></span> Delete Book</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/library/shiftshelf'><span className="fa fa-address-card fa-lg"></span>Shift Shelf</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link" to='/library/registration'><span className="fa fa-login-card fa-lg"></span>Add Librarian</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <Button outline onClick={logout}><span className="fa fa-sign-in fa-lg"></span> Logout</Button>
                        </NavItem>
                    </Nav>
                </div>
            </Navbar>
        </div>
    );
}
}
