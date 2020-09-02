import React from "react";
import InvoiceCard from "./InvoiceCard";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";

function Invoice() {
  return (
    <Paper elevation={3}>
      <div>
        <div className="dash-header flex justify-space-btwn">
          <h2>Invoices</h2>
          <Link to="/invoice/create-new-invoice">
            <button>add new invoice</button>
          </Link>
        </div>
        <div className="dash-body">
          <InvoiceCard />
        </div>
      </div>
    </Paper>
  );
}

export default Invoice;
