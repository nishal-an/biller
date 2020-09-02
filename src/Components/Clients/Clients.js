import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";

import { useQuery, gql } from "@apollo/client";

const GET_CLIENTS = gql`
  query GetClients {
    client(
      where: { organization_id: { _eq: "58bdf297bdcb49fcbe3bf84c5859a63d" } }
    ) {
      name
      phone
      gst_registered
      gstin
      state
    }
  }
`;

const useStyles = makeStyles({
  table: {},
});
function Client() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_CLIENTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const clients = data.client;
  // console.log(clients);
  // console.log(clients.client);

  return (
    <Paper elevation={3}>
      <div>
        <div className="dash-header flex justify-space-btwn">
          <h2>Clients</h2>
          <button>add new client</button>
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
                  <TableRow key={client.name}>
                    <TableCell component="th" scope="row">
                      {client.name}
                    </TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{client.gstin}</TableCell>
                    <TableCell>{client.state}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        className="yellow"
                      >
                        edit
                      </Button>
                      <Button size="small" variant="contained" color="primary">
                        view
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </Paper>
  );
}

export default Client;
