import React, { useState } from 'react';
import { RegisterForm } from './RegistrarionForm';
import { LoginForm } from './LoginForm';

export const forms = () =>{
    const [logint,setlogint]=useState(true);
    const [regt,setregt]=useState(false);


    function loginclick(){
        setlogint(true);
        setregt(false);
    }
    function registerclick(){
        setlogint(false);
        setregt(true);
    }

    return(
        <div className="login-register-wrapper">
        <div className="nav-buttons">
          <button onClick={loginclick}>
            Login
          </button>
          <button onClick={registerclick}>
            Register
          </button>
        </div>
        <div className="form-group">
          { logint &&
            <LoginForm/>
           }
          { regt &&
            <RegisterForm/>
          }
        </div>
      </div>
    );
}