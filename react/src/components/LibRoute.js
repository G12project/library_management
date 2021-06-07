import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({
  component: Component,
  is_lib,
  is_initialized,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        is_lib === true ? (
          <Component {...props} />
        ) : !is_initialized ? (
          ""
        ) : (
          <Redirect to="/loginpage" from={props.location}/>
        )
      }
    />
  );
};