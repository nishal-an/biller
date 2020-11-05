import React, { useReducer } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

import { gql, useMutation } from "@apollo/client";

// const GET_ADDRESS = gql`
//   query GetAddress {
//     address {
//       address
//       address_type
//       id
//       street
//       city
//       state
//       country
//       pincode
//       client_id
//     }
//   }
// `;
const UPDATE_CLIENT = gql`
  mutation AddClient(
    $date: timestamptz!
    $clientId: String!
    $mail: String
    $gstRegistered: Boolean
    $gstin: String
    $isActive: Boolean
    $name: String
    $orgId: String
    $phone: String
    $clientState: String
    $baddress: String
    $addType: String
    $bcity: String
    $bcountry: String
    $bpin: String
    $baddState: String
    $bstreet: String
    $baddId: String
    $saddress: String
    $scity: String
    $scountry: String
    $spin: String
    $saddState: String
    $sstreet: String
    $saddId: String
  ) {
    insert_client(
      objects: {
        added_on: $date
        email: $mail
        gst_registered: $gstRegistered
        gstin: $gstin
        id: $clientId
        is_active: $isActive
        name: $name
        organization_id: $orgId
        phone: $phone
        state: $clientState
        addresses: {
          data: [
            {
              added_on: $date
              address: $baddress
              address_type: "billing_address"
              city: $bcity
              client_id: $clientId
              country: $bcountry
              id: $baddId
              pincode: $bpin
              state: $baddState
              street: $bstreet
              name: $name
            }
            {
              added_on: $date
              address: $saddress
              address_type: "shipping_address"
              city: $scity
              client_id: $clientId
              country: $scountry
              id: $saddId
              pincode: $spin
              state: $saddState
              street: $sstreet
              name: $name
            }
          ]
          on_conflict: {
            constraint: address_pkey
            update_columns: [
              address
              city
              country
              pincode
              state
              name
              street
            ]
          }
        }
      }
      on_conflict: {
        constraint: client_pkey
        update_columns: [email, gstin, name, phone, state, name]
      }
    ) {
      returning {
        id
        name
      }
    }
  }
`;

function EditClient(props) {
  let { id } = useParams();

  let client;
  props.clients.find((item) => {
    if (item.id === id) {
      client = item;
    }
  });

  //   const { loading, error, data } = useQuery(GET_ADDRESS);
  //   if (loading) return <p>Loading...</p>;
  //   if (error) return <p>Error :</p>;
  console.log(client);

  let billAddress;
  let shipAddress;

  client.addresses.map((address) => {
    if (address.client_id === id) {
      if (address.address_type === "billing_address") billAddress = address;
      else shipAddress = address;
    }
  });
  // console.log(billAddress, shipAddress);
  const [
    updateClient,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_CLIENT);

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      clientName: client.name,
      gstin: client.gstin,
      clientState: client.state,
      phone: client.phone,
      email: client.email,
      baddress: billAddress.address,
      bstreet: billAddress.street,
      bcity: billAddress.city,
      bstate: billAddress.state,
      bpin: billAddress.pincode,
      bcountry: billAddress.country,
      saddress: shipAddress.address,
      sstreet: shipAddress.street,
      scity: shipAddress.city,
      sstate: shipAddress.state,
      spin: shipAddress.pincode,
      scountry: shipAddress.country,
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserInput({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // const organization = "58bdf297bdcb49fcbe3bf84c5859a63d";
    // const clientID = uuidv4();
    // const billaddrsID = uuidv4();
    // const shipaddrsID = uuidv4();
    // const clientDate = Moment().format();

    updateClient({
      variables: {
        date: client.added_on,
        clientId: client.id,
        mail: userInput.email,
        gstin: userInput.gstin,
        name: userInput.clientName,
        phone: userInput.phone,
        clientState: userInput.clientState,
        baddress: userInput.baddress,
        bcity: userInput.bcity,
        bcountry: userInput.bcountry,
        bpin: userInput.bpin,
        baddState: userInput.bstate,
        bstreet: userInput.bstreet,
        saddress: userInput.saddress,
        scity: userInput.scity,
        scountry: userInput.scountry,
        spin: userInput.spin,
        saddState: userInput.sstate,
        sstreet: userInput.sstreet,
        baddId: billAddress.id,
        saddId: shipAddress.id,
      },
    });
    // console.log(userInput.productName);
  };

  return (
    <Paper elevation={3}>
      <div>
        <div className="dash-header flex justify-space-btwn">
          <h2>Edit Client</h2>
        </div>
        <div className="dash-body">
          <form onSubmit={handleSubmit} id="newProductForm">
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  placeholder="Enter client name"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="clientName"
                  value={userInput.clientName}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="gstin"
                  placeholder="Enter GSTIN"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="gstin"
                  value={userInput.gstin}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="State"
                  placeholder="Enter State"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="clientState"
                  value={userInput.clientState}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  placeholder="Enter Phone"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="phone"
                  value={userInput.phone}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Email"
                  placeholder="Enter email"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="email"
                  value={userInput.email}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Billing Address</h3>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Address"
                  placeholder="Enter address"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="baddress"
                  value={userInput.baddress}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Street"
                  placeholder="Enter Street"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="bstreet"
                  value={userInput.bstreet}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="City"
                  placeholder="Enter city"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="bcity"
                  value={userInput.bcity}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="State"
                  placeholder="Enter state"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="bstate"
                  value={userInput.bstate}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Pincode"
                  placeholder="Enter PIN"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="bpin"
                  value={userInput.bpin}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Country"
                  placeholder="Enter country"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="bcountry"
                  value={userInput.bcountry}
                />
              </Grid>

              <Grid item xs={12}>
                <h3>Shipping Address</h3>
                <Button
                  variant="contained"
                  size="small"
                  className="green"
                  id="sameadrsBtn"
                >
                  same as billing address
                </Button>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Address"
                  placeholder="Enter address"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="saddress"
                  value={userInput.saddress}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Street"
                  placeholder="Enter Street"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="sstreet"
                  value={userInput.sstreet}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="City"
                  placeholder="Enter city"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="scity"
                  value={userInput.scity}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="State"
                  placeholder="Enter state"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="sstate"
                  value={userInput.sstate}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Pincode"
                  placeholder="Enter PIN"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="spin"
                  value={userInput.spin}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Country"
                  placeholder="Enter country"
                  fullWidth
                  margin="dense"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleChange}
                  name="scountry"
                  value={userInput.scountry}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" className="green">
                  update
                </Button>
                <Button variant="contained">
                  <Link to="/clients">cancel</Link>
                </Button>
              </Grid>
            </Grid>
          </form>
          {mutationLoading && <p>Loading...</p>}
          {mutationError && <p>Error :( Please try again</p>}
        </div>
      </div>
    </Paper>
  );
}

export default EditClient;
