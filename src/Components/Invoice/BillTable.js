import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";

const useStyles = makeStyles({});

export default function BillTable(props) {
  const classes = useStyles();

  const products = props.products;
  console.log(products);
  return (
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.product.id}>
              <TableCell component="th" scope="row">
                {product.product.name}
              </TableCell>
              <TableCell align="right">{product.quantity}</TableCell>
              <TableCell align="right">{product.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
