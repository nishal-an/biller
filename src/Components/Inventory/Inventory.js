import React from "react";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import Button from "@material-ui/core/Button";

import { useRouteMatch, Link, Route, Switch } from "react-router-dom";
import InventoryList from "./InventoryList";

import { useQuery } from "@apollo/client";
import ViewProduct from "./ViewProduct";

import GET_PRODUCTS from "../../queries/GetProduct";

function Inventory() {
  let { url, path } = useRouteMatch();

  const { loading, error, data } = useQuery(GET_PRODUCTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const products = data.product;

  // console.log(products);

  return (
    <Switch>
      <Route exact path={path}>
        <InventoryList products={products} url={url} />
      </Route>
      <Route path={`${path}/info/:id`}>
        <ViewProduct products={products} />
      </Route>
    </Switch>
  );
}

export default Inventory;
