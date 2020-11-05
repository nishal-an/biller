import React from "react";
import { Link } from "react-router-dom";
import "./docket.css";

function Docket() {
  return (
    <div className="docket">
      <ul>
        <Link to="/">
          <li>invoices</li>
        </Link>
        <Link to="/clients">
          <li>clients</li>
        </Link>
        <Link to="/inventory">
          <li>inventory</li>
        </Link>
        <li>report</li>
      </ul>
    </div>
  );
}

export default Docket;
