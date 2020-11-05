import React, { useReducer } from "react";
import Button from "@material-ui/core/Button";
import { Link, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

import { gql, useQuery } from "@apollo/client";
import InvoiceCard from "../Invoice/InvoiceCard";

// const GET_CLIENTS = gql`
//   query ViewClient($orgId: String!, $clientId: String!) {
//     client(
//       where: {
//         organization_id: { _eq: $orgId }
//         _and: { id: { _eq: $clientId } }
//       }
//     ) {
//       id
//       name
//       gst_registered
//       gstin
//       email
//       is_active
//       organization_id
//       phone
//       state
//       addresses(where: { client_id: { _eq: $clientId } }) {
//         address
//         address_type
//         city
//         client_id
//         country
//         id
//         organization_id
//         pincode
//         state
//         street
//       }
//     }
//   }
// `;

const GET_ADDRESS = gql`
  query GetAddress {
    address {
      address
      address_type
      id
      street
      city
      state
      country
      pincode
      client_id
    }
  }
`;

function ViewClient(props) {
  let { id } = useParams();

  const { loading, error, data } = useQuery(GET_ADDRESS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
  console.log(data);

  let billAddress;
  let shipAddress;

  data.address.find((address) => {
    if (address.client_id === id) {
      if (address.address_type === "billing_address") billAddress = address;
      else shipAddress = address;
    }
  });
  console.log(billAddress);
  console.log(shipAddress);

  let client;
  props.clients.find((item) => {
    if (item.id === id) {
      client = item;
    }
  });

  // console.log(client);

  return (
    <Paper elevation={3}>
      <div>
        <div className="dash-header flex justify-space-btwn">
          <h2>View Client</h2>
        </div>
        <div className="dash-body">
          <div style={{ textAlign: "right" }}>
            <Link to="/clients/edit-client">
              <Button size="small" variant="contained" color="primary">
                edit client
              </Button>
            </Link>
          </div>
          <div className="client-details">
            <h2>{client.name}</h2>
            <h4>GSTIN: {client.gstin}</h4>
            <div className="client-address">
              <div className="bill-address">
                <h3>Billing Address</h3>
                <div>
                  {billAddress.address}
                  <br />
                  {billAddress.street}, {billAddress.city}
                  <br />
                  {billAddress.state}
                  <br />
                  {billAddress.country}
                  <br />
                  PIN: {billAddress.pincode}
                </div>
              </div>
              <div className="ship-address">
                <h3>Shipping Address</h3>
                <div>
                  {shipAddress.address}
                  <br />
                  {shipAddress.street}, {shipAddress.city}
                  <br />
                  {shipAddress.state}
                  <br />
                  {shipAddress.country}
                  <br />
                  PIN: {shipAddress.pincode}
                </div>
              </div>
            </div>

            <div className="client-invoices">
              <InvoiceCard clientView="true" clientId={client.id} />
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}

export default ViewClient;
