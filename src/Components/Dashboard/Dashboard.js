import React from "react";
import { Route, Switch } from "react-router-dom";

import Invoice from "../Invoice/Invoice";
import CreateInvoice from "../Invoice/CreateInvoice";
import EditInvoice from "../Invoice/EditInvoice";
import Clients from "../Clients/Clients";
import AddClient from "../Clients/AddClient";
import Inventory from "../Inventory/Inventory";
import AddProduct from "../Inventory/AddProduct";
import Error from "../Error";

import "./dashboard.css";

const drawerWidth = 240;

const dashboardStyle = {
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: drawerWidth,
};

export default function Dashboard() {
  return (
    <div className="dashboard" style={dashboardStyle}>
      <div className="dashboard-container">
        <Switch>
          <Route exact path="/" component={Invoice} />
          <Route path="/invoice/create-new-invoice" component={CreateInvoice} />
          <Route path="/invoice/edit-invoice" component={EditInvoice} />
          <Route path="/clients/add-client" component={AddClient} />
          <Route path="/clients" component={Clients} />
          <Route path="/inventory/add-product" component={AddProduct} />
          <Route path="/inventory" component={Inventory} />

          <Route component={Error} />
        </Switch>
      </div>
    </div>
  );
}
