import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { useRouteMatch, Route, Switch, Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import { useQuery, gql } from "@apollo/client";
import ViewClient from "./ViewClient";
import EditClient from "./EditClient";

const GET_CLIENTS = gql`
  query ViewClient {
    client(
      where: { organization_id: { _eq: "58bdf297bdcb49fcbe3bf84c5859a63d" } }
    ) {
      id
      name
      gst_registered
      gstin
      email
      is_active
      organization_id
      phone
      state
      added_on
      addresses {
        address
        address_type
        id
        street
        city
        state
        country
        pincode
        client_id
      }
    }
  }
`;

const useStyles = makeStyles({
  table: {},
});

function Client() {
  let { url, path } = useRouteMatch();

  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const clients = data.client;
  // console.log(clients);

  return (
    <Switch>
      <Route exact path={path}>
        <Paper elevation={3}>
          <div>
            <div className="dash-header flex justify-space-btwn">
              <h2>Clients</h2>
              <Link to="/clients/add-client">
                <Button size="small" variant="contained" color="primary">
                  add new client
                </Button>
              </Link>
            </div>
            <div className="dash-body">
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Mobile</TableCell>
                      <TableCell>GSTIN</TableCell>
                      <TableCell>State</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell component="th" scope="row">
                          {client.name}
                        </TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.gstin}</TableCell>
                        <TableCell>{client.state}</TableCell>
                        <TableCell>
                          <Link to={`${url}/edit-client/${client.id}`}>
                            <Button
                              size="small"
                              variant="contained"
                              className="yellow"
                            >
                              edit
                            </Button>
                          </Link>
                          <Link to={`${url}/info/${client.id}`}>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                            >
                              view
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </Paper>
      </Route>
      <Route path={`${path}/edit-client/:id`}>
        <EditClient clients={clients} />
      </Route>
      <Route path={`${path}/info/:id`}>
        <ViewClient clients={clients} />
      </Route>
    </Switch>
  );
}

export default Client;
