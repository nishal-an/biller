import React, { useReducer, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { gql, useMutation } from "@apollo/client";

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $description: String
    $hsn_code: String
    $cgst: float8
    $sgst: float8
    $cess: float8
    $unit: String
    $price: float8
    $initial_stock: float8
    $remaining_stock: float8
    $organization_id: String
    $id: String
  ) {
    insert_product(
      objects: {
        name: $name
        description: $description
        hsn_code: $hsn_code
        cgst: $cgst
        sgst: $sgst
        cess: $cess
        unit: $unit
        price: $price
        initial_stock: $initial_stock
        remaining_stock: $initial_stock
        organization_id: "58bdf297bdcb49fcbe3bf84c5859a63d"
        id: $id
      }
    ) {
      returning {
        id
        name
        hsn_code
      }
    }
  }
`;

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

function ProductForm(props) {
  useEffect(() => {
    // const x = Array.from(document.getElementsByTagName("input"));
    // x.forEach((element) => {
    //   element.value = "";
    // });
  });
  if (props.isUpdate) {
  }

  const [
    addProduct,
    { loading: mutationLoading, error: mutationError, data },
  ] = useMutation(ADD_PRODUCT);

  const handleSubmit = (e) => {
    e.preventDefault();

    const prodID = uuidv4();

    addProduct({
      variables: {
        name: userInput.productName,
        description: userInput.productDescription,
        hsn_code: userInput.hsCode,
        cgst: userInput.taxRate / 2,
        sgst: userInput.taxRate / 2,
        cess: userInput.cessRate,
        unit: userInput.productUnit,
        price: userInput.unitPrice,
        initial_stock: userInput.currentStock,
        id: prodID,
      },
    });
    // console.log(userInput.productName);
  };

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
      currentStock: "",
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
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
          <Grid item xs={6}>
            <TextField
              label="Current Stock"
              placeholder="Stock in above mentioned units"
              fullWidth
              margin="dense"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleChange}
              name="currentStock"
              value={userInput.currentStock}
            />
          </Grid>
          <Grid item xs={6}>
            <Button type="submit" variant="contained" className="green">
              add product
            </Button>
            <Button variant="contained">
              <Link to="/inventory">cancel</Link>
            </Button>
          </Grid>
        </Grid>
      </form>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error :( Please try again</p>}
    </div>
  );
}

export default ProductForm;
