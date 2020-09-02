import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";

function CreateInvoice() {
  const [name, setName] = useState("");

  return (
    <Paper elevation={3}>
      <div>
        <div className="dash-header flex justify-space-btwn">
          <h2>New Invoice</h2>
        </div>
        <div className="dash-body">
          <form>
            <input
              name="sample"
              onChange={(e) => setName(e.target.value)}
              value={name}
            ></input>
          </form>
        </div>
      </div>
    </Paper>
  );
}

export default CreateInvoice;
