import React, { useReducer } from "react";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { useParams, Link } from "react-router-dom";
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
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid from "@material-ui/core/Grid";
import StockUpdates from "./StockUpdates";
import { v4 as uuidv4 } from "uuid";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Moment from "moment";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { useMutation, gql } from "@apollo/client";

const useStyles = makeStyles({
  root: {
    marginBottom: 50,
  },
  tableWrap: {
    marginBottom: 25,
  },
});

function ViewProduct(props) {
  const classes = useStyles();

  let { id } = useParams();

  let product;
  props.products.map((item) => {
    if (item.id === id) {
      product = item;
    }
  });

  // console.log(product);

  return (
    <div>
      <Paper elevation={3} className={classes.root}>
        <div className="dash-header flex justify-space-btwn">
          <h2>{product.name}</h2>
        </div>
        <div className="dash-body">
          <TableContainer component={Paper} className={classes.tableWrap}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">HSN Code</TableCell>
                  <TableCell align="center">Description</TableCell>
                  <TableCell align="center">Current Stock</TableCell>
                  <TableCell align="center">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell align="center">{product.hsn_code}</TableCell>
                  <TableCell align="center">{product.description}</TableCell>
                  <TableCell align="center">
                    {product.remaining_stock} {product.unit}
                  </TableCell>
                  <TableCell align="center">{product.price}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <ProductUpdates product={product} />
        </div>
      </Paper>
      <StockUpdates productId={product.id} />
    </div>
  );
}

export default ViewProduct;

//query for grtting the remaining stock
// const GET_PRODUCT = gql`
//   query GetProduct($productId: String!) {
//     product(where: { id: { _eq: $productId } }) {
//       remaining_stock
//     }
//   }
// `;

// mutation for product update
const UPDATE_PRODUCT = gql`
  mutation MyMutation(
    $productId: String!
    $name: String!
    $description: String
    $hsn_code: String
    $cgst: float8
    $sgst: float8
    $cess: float8
    $unit: String
    $price: float8
    $organization_id: String
  ) {
    update_product(
      where: { id: { _eq: $productId } }
      _set: {
        name: $name
        description: $description
        hsn_code: $hsn_code
        cgst: $cgst
        sgst: $sgst
        cess: $cess
        unit: $unit
        price: $price
        organization_id: "58bdf297bdcb49fcbe3bf84c5859a63d"
      }
    ) {
      affected_rows
      returning {
        id
        name
      }
    }
  }
`;

// mutation for stock update
const STOCK_INSERT = gql`
  mutation StockUpdate(
    $date: timestamp!
    $description: String
    $id: String!
    $productId: String!
    $quantity: numeric
    $price: float8
    $remainingStock: float8
  ) {
    insert_stock_update(
      objects: {
        date: $date
        description: $description
        id: $id
        product_id: $productId
        purchase_quantity: $quantity
        price: $price
      }
    ) {
      affected_rows
      returning {
        id
        purchase_quantity
        product_id
      }
    }
    update_product(
      where: { id: { _eq: $productId } }
      _set: { remaining_stock: $remainingStock }
    ) {
      returning {
        id
        remaining_stock
        name
      }
    }
  }
`;

////Styles
const useStylesm = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 600,
    margin: "0 auto",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 0,
    position: "relative",
  },
}));
/////////

function ProductUpdates(props) {
  // const { loading, error, data } = useQuery(GET_PRODUCT);
  // if (loading) return <p>Fetching data from product</p>;
  // if (error) return <p>Error GET_PRODUCT</p>;

  // console.log(data);

  const product = props.product;
  console.log(product.remaining_stock);

  ///***** form input handler *///////////
  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      productName: product.name,
      productDescription: product.description,
      hsCode: product.hsn_code,
      taxRate: product.cgst * 2,
      cessRate: product.cess,
      productUnit: product.unit,
      unitPrice: product.price,
      description: "",
      updateQuantity: "",
      stockUpdateId: "",
      purchaseQty: "",
      purcahsePrice: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    // if (type === "checkbox") {
    //   console.log([name]);
    //   setUserInput((prevState) => ({
    //     [name]: !prevState[name],
    //   }));
    // }
    setUserInput({ [name]: value });
  };

  ////////////////////////////////

  ////////******* for stock update***** */
  const resetInput = () => {
    setUserInput({
      description: "",
      updateQuantity: "",
      purchaseDate: "",
      stockUpdateId: "",
      purchaseQty: "",
      purcahsePrice: "",
    });
  };

  const [
    insertStockUpdate,
    { loading: stockUpdationLoading, error: stockUpdationError },
  ] = useMutation(STOCK_INSERT, { onCompleted: resetInput });

  //handle date change
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // console.log(userInput.purchaseQty);
  // console.log(Moment(selectedDate).format());

  const handleStockUpdate = (e) => {
    e.preventDefault();

    const stockUpdateId = uuidv4();

    const stckLeft =
      parseFloat(product.remaining_stock) + parseFloat(userInput.purchaseQty);

    insertStockUpdate({
      variables: {
        date: Moment(selectedDate).format(),
        description: userInput.description,
        id: stockUpdateId,
        productId: product.id,
        quantity: userInput.purchaseQty,
        price: userInput.purcahsePrice,
        remainingStock: stckLeft,
      },
    });
  };
  ///////////////////////////////////

  //////******** for product uppdate */
  const [
    updateProduct,
    { loading: productUpdationLoading, error: productUpdationError },
  ] = useMutation(UPDATE_PRODUCT);

  const handleSubmitProductUpdate = (e) => {
    e.preventDefault();
    updateProduct({
      variables: {
        name: userInput.productName,
        description: userInput.productDescription,
        hsn_code: userInput.hsCode,
        cgst: userInput.taxRate / 2,
        sgst: userInput.taxRate / 2,
        cess: userInput.cessRate,
        unit: userInput.productUnit,
        price: userInput.unitPrice,
        productId: product.id,
      },
    });
  };

  ////**********for modal */

  const classes = useStylesm();
  const [stockopen, setStockOpen] = React.useState(false);
  const [productopen, setProductOpen] = React.useState(false);

  const handleStockOpen = () => {
    setStockOpen(true);
  };

  const handleClose = () => {
    setStockOpen(false);
    setProductOpen(false);
  };
  ///////////////////////

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleStockOpen}>
        update stock
      </Button>

      <Button variant="contained" onClick={setProductOpen}>
        update product
      </Button>

      <Modal
        id="stockmodal"
        className={classes.modal}
        open={stockopen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={stockopen}>
          <div className={classes.paper}>
            <h2>Update Stock</h2>
            <CloseIcon className="close-icn" onClick={handleClose} />
            <form className="modal-form" onSubmit={handleStockUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="dense"
                      id="date-picker-inline"
                      label="Date picker inline"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />{" "}
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Quantity"
                    placeholder="Quantity"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                    }}
                    onChange={handleChange}
                    name="purchaseQty"
                    value={userInput.purchaseQty}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Price"
                    placeholder="Price"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    onChange={handleChange}
                    name="purcahsePrice"
                    value={userInput.purcahsePrice}
                  />
                </Grid>

                <Grid item xs={12} className={classes.lastField}>
                  <TextField
                    label="Description"
                    placeholder="Description"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange}
                    name="description"
                    value={userInput.description}
                  />
                </Grid>
              </Grid>
              <div className="modal-btns-wrap">
                <Button type="submit" variant="contained" color="primary">
                  update
                </Button>

                <Button variant="contained" onClick={handleClose}>
                  close
                </Button>
              </div>
            </form>
            {stockUpdationLoading && <p>Loading...</p>}
            {stockUpdationError && <p>Error :( Please try again</p>}
          </div>
        </Fade>
      </Modal>

      <Modal
        id="productmodal"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={productopen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={productopen}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Update Product</h2>
            <CloseIcon className="close-icn" onClick={handleClose} />
            <form onSubmit={handleSubmitProductUpdate}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    placeholder="Product Name"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange}
                    name="productName"
                    value={userInput.productName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    placeholder="Enter Description"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange}
                    name="productDescription"
                    value={userInput.productDescription}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="HS Code"
                    placeholder="Enter HS Code"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange}
                    name="hsCode"
                    value={userInput.hsCode}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="Tax Rate"
                    placeholder="Tax Percentage (eg: 18)"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    onChange={handleChange}
                    name="taxRate"
                    value={userInput.taxRate}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    label="CESS Rate"
                    placeholder="CESS Percentage (eg: 1)"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    onChange={handleChange}
                    name="cessRate"
                    value={userInput.cessRate}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    label="Unit"
                    placeholder="eg: Kg"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange}
                    name="productUnit"
                    value={userInput.productUnit}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Unit Price"
                    placeholder="Enter price"
                    fullWidth
                    margin="dense"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                    }}
                    onChange={handleChange}
                    name="unitPrice"
                    value={userInput.unitPrice}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" className="green">
                    update
                  </Button>
                  <Button variant="contained">
                    <Link to="/inventory">cancel</Link>
                  </Button>
                </Grid>
              </Grid>
            </form>
            {productUpdationLoading && <p>Loading...</p>}
            {productUpdationError && <p>Error :( Please try again</p>}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
