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
import StockUpdates from "./StockUpdates";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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

function ProductUpdates(props) {
  const product = props.product;
  console.log(product);

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      productName: "",
      productDescription: "",
      hsCode: "",
      taxRate: "",
      cessRate: "",
      productUnit: "",
      unitPrice: "",
      description: "",
      updateQuantity: "",
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
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

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
            <form className="modal-form">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="dd/mm/yyyy"
                      id="date-picker-inline"
                      label="Date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
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
                    name="updateQuantity"
                    value={userInput.taxRate}
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
                    value={userInput.productName}
                  />
                </Grid>
              </Grid>
              <div className="modal-btns-wrap">
                <Button variant="contained" color="primary">
                  save changes
                </Button>

                <Button variant="contained" onClick={handleClose}>
                  close
                </Button>
              </div>
            </form>
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
            <form className="modal-form">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    placeholder="Product Name"
                    fullWidth
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
                    placeholder="Description"
                    fullWidth
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
                    placeholder="HS Code"
                    fullWidth
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
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleChange}
                    name="productUnit"
                    value={userInput.productUnit}
                  />
                </Grid>
                <Grid item xs={6} className={classes.lastField}>
                  <TextField
                    label="Unit Price"
                    placeholder="Enter price"
                    fullWidth
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
              </Grid>
              <div className="modal-btns-wrap">
                <Button variant="contained" color="primary">
                  save changes
                </Button>

                <Button variant="contained" onClick={handleClose}>
                  close
                </Button>
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
