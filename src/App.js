import React from "react";
import "./App.css";

import Header from "./Components/Header/Header";
import Docket from "./Components/Docket/Docket";
import Dashboard from "./Components/Dashboard/Dashboard";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://invogen-test-gql.herokuapp.com/v1/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Header />

      <div className="dashboard-wrap flex">
        <Docket />
        <Dashboard />
      </div>
    </ApolloProvider>
  );
}

export default App;
