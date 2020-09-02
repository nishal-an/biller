import React from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { useParams } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CloseIcon from "@material-ui/icons/Close";
import { useReducer } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import MomentUtils from "@date-io/moment";
import Grid from "@material-ui/core/Grid";
import { gql, useQuery } from "@apollo/client";

const INVENTORY_UPDATES = gql`
  query InventoryUpdate($productId: String!) {
    stock_update(order_by: { date: desc }, where: { id: { _eq: $productId } }) {
      date
      description
      id
      price
      product_id
      purchase_quantity
      sales_quantity
    }
  }
`;

function StockUpdates(props) {
  const productId = props.productId;

  const { loading, error, data } = useQuery(INVENTORY_UPDATES, {
    variables: { productId },
  });
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const inventoryList = data.stock_update;
  console.log(inventoryList);

  return (
    <Paper elevation={3}>
      <div className="dash-header flex justify-space-btwn">
        <h2>Stock Updates</h2>
      </div>
      <div className="dash-body">
        <TableContainer>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Purchased</TableCell>
                <TableCell align="center">Sold</TableCell>
                <TableCell align="center">Remaining</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  lorem
                </TableCell>
                <TableCell align="center">lorem</TableCell>
                <TableCell align="center">lorem</TableCell>
                <TableCell align="center">lorem</TableCell>
                <TableCell align="center">lorem</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}

export default StockUpdates;
