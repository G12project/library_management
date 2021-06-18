import React, { useState } from 'react';
import { RegisterForm } from './RegistrarionForm';
import { LoginForm } from './LoginForm';
import {Container ,Col, Row, Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import classnames from 'classnames';
import '../styles/loginform.css';

export const AuthForms = (props) =>{
  const [activeTab, setActiveTab] = useState('1');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }
  function loginclick(){
    setActiveTab('1');
  }
  if (props.is_authenticated) {
    return (
      <div>Logged in as {props.user}.<br /> If you wish to login with another account, please logout first.</div>
    )
  }
  else{
    return(
      <Container>
      <Row>
          <Col sm="12" md={{ size: 4, offset: 4 }} style={{ marginTop: "30px", color: "white", background: "#333333", paddingBottom: "30px", minHeight:"450px"}}>
          <Nav tabs fill>
            <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '1' })}
                  onClick={() => { toggle('1'); }}
                >Sign In</NavLink>
            </NavItem>
            <NavItem>
                <NavLink
                  className={classnames({ active: activeTab === '2' })}
                  onClick={() => { toggle('2'); }}
                  >Sign Up</NavLink>
            </NavItem>
          </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <LoginForm set_is_authenticated={props.set_is_authenticated} setuser={props.setuser} />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <RegisterForm loginclick={loginclick} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Col>
      </Row>
      </Container>
    );
  }
}