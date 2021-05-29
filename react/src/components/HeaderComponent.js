import React, { useState } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggler, Collapse, NavItem, Jumbotron, Button, Modal, ModalHeader, ModalBody,Form, FormGroup, Input, Label } from 'reactstrap';
import { NavLink } from 'react-router-dom';


export const Header = (props)=> {
      const[isNavOpen, setNav]=useState(false)
    return(
        <div>
            <Navbar dark className="bg-dark" expand="md">
                <div className="container">
                    <NavbarToggler onClick={()=>setNav(!isNavOpen)} />
                    <NavbarBrand className="mr-auto" href="/"></NavbarBrand>
                    <Collapse isOpen={isNavOpen} navbar>
                        <Nav navbar>
                        <NavItem>
                            <NavLink className="nav-link"  to='/home'><span className="fa fa-home fa-lg"></span> Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to='/list/shelf'><span className="fa fa-info fa-lg"></span> Books</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link"  to='/friends'><span className="fa fa-list fa-lg"></span> Menu</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="nav-link" to='/contactus'><span className="fa fa-address-card fa-lg"></span> Contact Us</NavLink>
                        </NavItem>
                        </Nav>
                    </Collapse>
            <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Button outline onClick={this.toggleModal}><span className="fa fa-sign-in fa-lg"></span> Logout</Button>
                            </NavItem>
                        </Nav>
                </div>
            </Navbar>
        </div>
    );
}
