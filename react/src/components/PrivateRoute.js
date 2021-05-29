import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  is_authenticated,
  is_initialized,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        is_authenticated === true ? (
          <Component {...props} />
        ) : !is_initialized ? (
          ""
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;