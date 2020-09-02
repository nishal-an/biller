import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  table: {},
});

export default function (props) {
  const classes = useStyles();
  const products = props.products;
  const url = props.url;

  return (
    <Paper elevation={3}>
      <div>
        <div className="dash-header flex justify-space-btwn">
          <h2>Products</h2>
          <Link to="/inventory/add-product">
            <button>add new product</button>
          </Link>
        </div>
        <div className="dash-body">
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              aria-label="simple table"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">HSN Code</TableCell>
                  <TableCell align="center">SGST</TableCell>
                  <TableCell align="center">CGST</TableCell>
                  <TableCell align="center">Price</TableCell>
                  <TableCell align="center">Stock Available</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell component="th" scope="row">
                      {product.name}
                    </TableCell>
                    <TableCell align="center">{product.hsn_code}</TableCell>
                    <TableCell align="center">{product.sgst}</TableCell>
                    <TableCell align="center">{product.cgst}</TableCell>
                    <TableCell align="center">{product.price}</TableCell>
                    <TableCell align="center">
                      {product.remaining_stock} {product.unit}
                    </TableCell>
                    <TableCell align="center">
                      <Link to={`${url}/info/${product.id}`}>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                        >
                          view product
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
  );
}
