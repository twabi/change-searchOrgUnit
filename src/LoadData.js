import React, {Fragment, useState} from "react";
import {getInstance} from "d2";
import {Switch, Route} from "react-router-dom";
import App from "./App";

const LoadData = (props) => {

    const [users, setUsers] = React.useState([]);
    const [userGroups, setGroups] = React.useState([]);
    const [roles, setRoles] = React.useState([]);
    const [D2, setD2] = React.useState();
    const [initAuth, setInitAuth] = useState(props.auth);
    const [orgUnits, setOrgUnits] = React.useState([]);

    React.useEffect(() => {
        setInitAuth(props.auth);

        getInstance().then((d2) => {
            setD2(d2);
            const userPoint = "users.json?fields=*&paging=false";
            const groupPoint = "userGroups.json?paging=false&fields=id,displayName,users[id]";
            const rolesPoint = "userRoles.json?paging=false";
            const orgEndpoint = "organisationUnits.json?fields=id,name,parent&paging=false";

            //get the users from their endpoint
            d2.Api.getApi().get(userPoint)
                .then((response) => {
                    setUsers(response.users);
                })
                .catch((error) => {
                    console.log(error);
                    alert("An error occurred: " + error);
                });

            //get all the user groups defined in the system
            d2.Api.getApi().get(groupPoint)
                .then((response) => {
                    setGroups(response.userGroups);
                })
                .catch((error) => {
                    console.log(error);
                    alert("An error occurred: " + error);
                });

            //get all the user roles available in the system
            d2.Api.getApi().get(rolesPoint)
                .then((response) => {
                    setRoles(response.userRoles);
                })
                .catch((error) => {
                    console.log(error);
                    alert("An error occurred: " + error);
                });

            d2.Api.getApi().get(orgEndpoint).then((response) => {
                setOrgUnits(response.organisationUnits);
            })
                .catch((error) => {
                    console.log(error);
                    alert("An error occurred: " + error);
            });
        });

    }, [props]);


    return (
            <Fragment>
                <Switch>
                    <Route path="/"  render={(props) => (
                        <App {...props}
                             auth={initAuth}
                             d2={D2}
                             users={users}
                             orgUnits={orgUnits}
                             userGroups={userGroups}
                             userRoles={roles}
                        />
                    )} exact/>
                </Switch>
            </Fragment>
    );
}

export default LoadData;
