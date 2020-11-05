import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { gql, useQuery } from "@apollo/client";
import Moment from "moment";

const INVENTORY_UPDATES = gql`
  query InventoryUpdate($productId: String!) {
    stock_update(
      order_by: { date: desc }
      where: { product_id: { _eq: $productId } }
    ) {
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
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const inventoryList = data.stock_update;
  // console.log(inventoryList);

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
                <TableCell align="center">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {Moment(item.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell align="center">{item.description}</TableCell>
                  <TableCell align="center">{item.purchase_quantity}</TableCell>
                  <TableCell align="center">{item.sales_quantity}</TableCell>
                  <TableCell align="center">{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
  );
}

export default StockUpdates;
