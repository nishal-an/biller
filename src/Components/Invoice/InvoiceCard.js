import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Moment from "moment";
import { Link } from "react-router-dom";

import "./invoice.css";

import { useQuery, gql } from "@apollo/client";

import BillTable from "./BillTable";

const GET_INVOICES = gql`
  query GetInvoices {
    invoice(
      where: { organization_id: { _eq: "58bdf297bdcb49fcbe3bf84c5859a63d" } }
      order_by: { created_date: desc }
    ) {
      invoice_number
      created_date
      client {
        name
      }
      id
      net_amount
      products {
        price
        quantity
        product {
          name
        }
      }
    }
  }
`;

const useStyles = makeStyles({
  root: {
    minWidth: 255,
    marginBottom: 20,
  },
});

export default function InvoiceCard() {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_INVOICES);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const INVOICES = data.invoice;
  // console.log(INVOICES);

  return (
    <div>
      {INVOICES.map((invoice) => (
        <Card className={classes.root} key={invoice.id}>
          <CardContent>
            <div className="flex">
              <div className="inv-nm-date">
                <div className="invoice-nm">{invoice.invoice_number}</div>
                <div className="date">
                  {Moment(invoice.created_date).format("DD-MM-YYYY")}
                </div>
              </div>

              <div className="billing-details">
                <div className="client-details flex justify-space-btwn">
                  <div className="client-name">{invoice.client.name}</div>
                  <div className="tot-amount">{invoice.net_amount}</div>
                </div>

                <div className="billTable">
                  <BillTable
                    key={invoice.products.id}
                    products={invoice.products}
                  />
                </div>
              </div>

              <div className="actions">
                <Button size="small" variant="contained" color="primary">
                  download
                </Button>
                <Link to="/invoice/edit-invoice">
                  <Button size="small" variant="contained" className="yellow">
                    edit
                  </Button>
                </Link>
                <Button size="small" variant="contained" className="red">
                  delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
