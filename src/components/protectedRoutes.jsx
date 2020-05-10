import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../components/admin/adminDashboard/Authentication/UserFunctions";

export const ProtectedRoute = ({
    component: Component,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={props => {
                if (!isAuthenticated()) { // '!' EMEKA's ADDITION please remove when you can legally login
                    return <Component {...props} />;
                } else {
                    return (
                        <Redirect
                            to={{
                                pathname: "/auth/login",
                                state: {
                                    from: props.location
                                }
                            }}
                        />
                    );
                }
            }}
        />
    );
};
