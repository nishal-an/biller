import React, { useReducer, useState } from "react";
import Paper from "@material-ui/core/Paper";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import Moment from "moment";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputAdornment from "@material-ui/core/InputAdornment";

import { gql, useMutation, useQuery } from "@apollo/client";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Client from "../Clients/Clients";

const GET_CLIENT = gql`
  query GetClients {
    client(
      where: { organization_id: { _eq: "58bdf297bdcb49fcbe3bf84c5859a63d" } }
    ) {
      name
      id
    }
  }
`;

const GET_PRODUCT = gql`
  query GetProducts {
    product(
      where: { organization_id: { _eq: "58bdf297bdcb49fcbe3bf84c5859a63d" } }
    ) {
      cess
      cgst
      hsn_code
      id
      igst
      is_taxable
      price
      remaining_stock
      sgst
      total_gst
      unit
      name
    }
  }
`;
const ADD_INVOICE = gql`
  mutation AddInvoice(
    $billing_address_id: String
    $cess_amount: float8
    $cgst_amount: float8
    $client: client_obj_rel_insert_input
    $client_id: String
    $created_date: timestamptz
    $id: String
    $igst_amount: float8
    $invoice_date: timestamptz
    $invoice_number: String
    $net_amount: float8
    $organization_id: String
    $products: stock_update_arr_rel_insert_input
    $round_off: float8
    $sgst_amount: float8
    $shipping_address_id: String
    $tax_amount: float8
    $total_amount: float8
    $vehicle_number: String
  ) {
    insert_invoice(
      objects: {
        billing_address_id: $billing_address_id
        cess_amount: $cess_amount
        cgst_amount: $cgst_amount
        client_id: $client_id
        created_date: created_date
        id: $id
        igst_amount: $igst_amount
        invoice_date: $invoice_date
        invoice_number: $invoice_number
        net_amount: $net_amount
        organization_id: $organization_id
        round_off: $round_off
        sgst_amount: $sgst_amount
        shipping_address_id: $shipping_address_id
        tax_amount: $tax_amount
        total_amount: $total_amount
        vehicle_number: $vehicle_number
      }
    ) {
      affected_rows
    }
  }
  mutation AddInvoiceProduct($invoiceProducts: stock_update_insert_input!) {
    insert_stock_update(objects: [$invoiceProducts]) {
      affected_rows
    }
  }
`;
const useStyles = makeStyles((theme) => ({
  selectformControl: {
    minWidth: 120,
    width: "100%",
    marginTop: 16,
    marginBottom: 8,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const initialProduct = {
  id: uuidv4(),
  invoice_id: "",
  product_id: "",
  product_name: "",
  price: "",
  quantity: "",
};

function CreateInvoice() {
  const classes = useStyles();

  const [productList, setList] = React.useState([initialProduct]);

  //handle date change
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      // clientName: "",
      // vehicleNumber: "",
      // invoiceNumber: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInput({ [name]: value });
  };

  const onItemUpdate = () => {
    const subTotal = productList.reduce((sum, product) => {
      return sum + parseInt(product.quantity) * parseInt(product.price);
    }, 0);
    const taxPercentage = 5;
    const cessPercentage = 1;

    const taxAmount = subTotal + (subTotal * taxPercentage) / 100;
    const cessAmount = subTotal + (subTotal * cessPercentage) / 100;

    const total = subTotal + taxAmount + cessAmount;

    console.log("subtotal", subTotal);
    console.log("taxPercen", taxPercentage);
    console.log("total", total);
  };

  React.useEffect(() => {
    onItemUpdate();
  }, [productList]);

  // const handleChangeProduct = (e) => {
  //   const { name, value } = e.target;
  //   setUserInput({ [name]: value });
  // };

  const handleAddItem = () => {
    const uuid = uuidv4();

    setList([
      ...productList,
      {
        ...initialProduct,
        id: uuid,
      },
    ]);
  };
  console.log(productList);

  function handleRomoveItem(id) {
    setList(productList.filter((item) => item.id !== id));
  }

  // const [addInvoice] = useMutation(ADD_INVOICE, {
  //   onCompleted: (d) => {
  //     console.log(d);
  //   },
  // });

  const {
    loading: loadingClient,
    error: clientError,
    data: clientData,
  } = useQuery(GET_CLIENT);
  if (loadingClient) return <div>..</div>;
  if (clientError) return <div>error</div>;
  console.log(clientData);

  const handleProductItemChange = (id, name, value) => {
    const fieldName = name.split("#@#")[0];

    setList(
      productList.map((product) => {
        if (product.id === id) {
          return {
            ...product,
            [fieldName]: value,
          };
        }
        return product;
      })
    );
  };

  // const {
  //   loading: loadingProduct,
  //   error: productError,
  //   data: productData,
  // } = useQuery(GET_PRODUCT);
  // if (loadingProduct) return <div>loading</div>;
  // if (productError) return <div>error</div>;
  // console.log(productData);

  const handleSubmit = (e) => {
    e.preventDefault();
    // addInvoice ({
    //   variables: {
    //     billing_address_id: userInput.
    //     cess_amount: userInput.
    //     cgst_amount: userInput.
    //     client_id: userInput.
    //     created_date: userInput.
    //     id: userInput.
    //     igst_amount: userInput.,
    //     invoice_date: Moment(selectedDate).format(),
    //     invoice_number: userInput.invoiceNumber
    //     net_amount: userInput.
    //     organization_id: userInput.
    //     round_off: userInput.
    //     sgst_amount: userInput.
    //     shipping_address_id: userInput.
    //     tax_amount: userInput.
    //     total_amount: userInput.
    //     vehicle_number: userInput.vehicleNumber
    //   }
    // })
  };

  return (
    <Paper elevation={3}>
      <div>
        <div className="dash-header flex justify-space-btwn">
          <h2>New Invoice</h2>
        </div>
        <div className="dash-body">
          <form onSubmit={handleSubmit} id="newProductForm">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <FormControl className={classes.selectformControl}>
                  <InputLabel shrink id="client-name-select">
                    Client
                  </InputLabel>

                  <Select
                    name="clientName"
                    value={userInput.clientName}
                    onChange={handleChange}
                    displayEmpty
                    className={classes.selectEmpty}
                  >
                    <MenuItem value="">
                      <em>Client</em>
                    </MenuItem>
                    {clientData.client.map((item) => (
                      <MenuItem value={item.name}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Vehicle Number"
                  placeholder="Enter Vehicle Number"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="vehicleNumber"
                  value={userInput.vehicleNumber}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Invoice No"
                  placeholder="Enter Invoice Number"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="invoiceNumber"
                  value={userInput.invoiceNumber}
                />
              </Grid>
              <Grid item xs={6}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="ivoice-date-picker"
                    label="Invoice date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />{" "}
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>

            {productList.map((item, index) => (
              <ProductRow
                key={item.id}
                row={item}
                index={index}
                handleRomove={handleRomoveItem}
                handleItemChange={handleProductItemChange}
              />
            ))}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <div className="bill-amount">
                  <div className="amount-item">
                    <span className="amt-title">Amount</span>
                    <span className="amt-price">55</span>
                  </div>
                  <div className="amount-item">
                    <span className="amt-title">Tax Amount</span>
                    <span className="amt-price">0</span>
                  </div>
                  <div className="amount-item">
                    <span className="amt-title">Cess Amount</span>
                    <span className="amt-price">0</span>
                  </div>
                  <div className="amount-item">
                    <span className="amt-title">Total</span>
                    <span className="amt-price">55</span>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    className="yellow"
                    onClick={handleAddItem}
                  >
                    add item
                  </Button>
                  <div>
                    <Button size="small" variant="contained">
                      cancel
                    </Button>
                    <Button size="small" variant="contained" className="green">
                      save changes
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          </form>
        </div>
      </div>
    </Paper>
  );
}

export default CreateInvoice;

const ProductRow = (props) => {
  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;

    props.handleItemChange(props.row.id, name, value);
  };

  const {
    loading: loadingProduct,
    error: productError,
    data: productData,
  } = useQuery(GET_PRODUCT);
  if (loadingProduct) return <div>loading</div>;
  if (productError) return <div>error</div>;

  console.log(productData);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div className="invoice-prod-no">
          <h3 style={{ display: "inline-block" }}>Item {props.index + 1}</h3>
          <Button
            size="small"
            variant="contained"
            onClick={() => props.handleRomove(props.row.id)}
          >
            remove item
          </Button>
        </div>
      </Grid>

      <Grid item xs={4}>
        <FormControl className={classes.selectformControl}>
          <InputLabel shrink id="product-select">
            Product
          </InputLabel>
          <Select
            name={`product_id#@#${props.row.id}`}
            value={props.row.product_id}
            onChange={handleChange}
            displayEmpty
            className={classes.selectEmpty}
          >
            <MenuItem value="">
              <em>Product</em>
            </MenuItem>
            {productData.product.map((product) => (
              <MenuItem key={product.id} value={product.name}>
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={4}>
        <TextField
          label="Quantity"
          placeholder="Enter Quantity"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
          name={`quantity#@#${props.row.id}`}
          value={props.row.quantity}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Rate"
          placeholder="Enter price"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
          name={`price#@#${props.row.id}`}
          value={props.row.price}
        />
      </Grid>
    </Grid>
  );
};
